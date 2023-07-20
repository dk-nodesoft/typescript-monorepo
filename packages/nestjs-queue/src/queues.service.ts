/* eslint-disable @typescript-eslint/no-explicit-any */
import { OopsError } from '@dk-nodesoft/base-exceptions';
import { createCuid, dayjs, forEachLimit } from '@dk-nodesoft/ts-utils';
import { getQueueToken } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CONTEXT_REQUEST_ID, USER_ID_SYSTEM } from '@shared/nestjs-core';
import type { CronRepeatOptions, EveryRepeatOptions, JobOptions, Queue } from 'bull';
import { plainToClass } from 'class-transformer';
import { ClsServiceManager } from 'nestjs-cls';
import type { JsonObject } from 'type-fest';
import type { EmittedJob, EmittedJobContext, EmittedJobRepeat } from './emitted-jobs';
import { CreateEmittedJobDto, isEmittedJobContext } from './emitted-jobs';
import { EmittedJobsService } from './emitted-jobs/emitted-jobs.service';
import { Topics } from './topics/topics';
import type { Topic, TopicName, TopicPayload } from './types';

type TopicEmitOptions<T extends JsonObject = JsonObject, U extends EmittedJobContext = EmittedJobContext> = {
  topic: TopicName;
  context?: U;
  data?: T;
  jobOptions?: JobOptions;
};

@Injectable()
export class QueuesService {
  constructor(private queueEmittedJobsService: EmittedJobsService, private moduleRef: ModuleRef) {}

  private resolveContext(payload: any, context?: EmittedJobContext): EmittedJobContext {
    const cls = ClsServiceManager.getClsService();

    if (isEmittedJobContext(context)) {
      return {
        requestId: context.requestId || createCuid(),
        userId: context.userId || payload.userId || USER_ID_SYSTEM
      };
    }

    return {
      requestId: cls.get(CONTEXT_REQUEST_ID) || createCuid()
    };
  }

  private getTopicClass<U extends Topic = Topic>(topic: TopicName): U {
    return Topics.getInstance().getTopic<U>(topic);
  }

  private getTopicQueue(topic: TopicName): Queue {
    const topicClass = this.getTopicClass(topic);
    const topicQueue = this.moduleRef.get<Queue>(getQueueToken(topicClass.queue), { strict: false });

    if (!topicQueue) {
      throw new OopsError({ message: `Queue is not defined for topic`, details: { topic, queue: topicClass.queue } });
    }

    return topicQueue;
  }

  public async emitTopic<T extends JsonObject = JsonObject>({
    topic,
    data,
    context,
    jobOptions
  }: TopicEmitOptions<T>): Promise<EmittedJob> {
    const emittedJobDto = plainToClass(CreateEmittedJobDto, { topic, data });

    const topicClass = this.getTopic(emittedJobDto.topic);
    const topicQueue = this.getTopicQueue(emittedJobDto.topic);

    const transformedPayload = topicClass.transformPayload(emittedJobDto);
    const skipFilter = topicClass.skipFilter(emittedJobDto);

    const resolvedContext = this.resolveContext(transformedPayload, context);

    const repeat: EmittedJobRepeat | undefined = jobOptions?.repeat
      ? { ...jobOptions.repeat, limit: 1, tz: 'Europe/Copenhagen' }
      : undefined;
    const deleteAt = dayjs().add(topicClass.cleanUpAfter, 'day').toDate();
    // const deleteAt = dateFns.add(new Date(), { days: topicClass.cleanUpAfter });
    const emittedJob = await this.queueEmittedJobsService.createEmittedJob(
      {
        ...emittedJobDto,
        data: transformedPayload,
        context: resolvedContext
      },
      topicQueue.name,
      deleteAt,
      repeat
    );

    if (skipFilter) {
      await this.queueEmittedJobsService.setSkipped({ _id: emittedJob.id });
      return emittedJob;
    }

    const payload: TopicPayload = {
      emittedJobId: emittedJob.id,
      data: { ...transformedPayload },
      context: emittedJob.context
    };

    await topicQueue.add(emittedJob.topic, payload, {
      jobId: emittedJob.hash,
      removeOnComplete: true,
      removeOnFail: true,
      ...topicClass.jobOptions,
      ...jobOptions
    });

    return emittedJob;
  }

  public hasTopic(topic: TopicName): boolean {
    return Topics.getInstance().hasTopic(topic);
  }

  public getTopic(topic: TopicName): Topic {
    return Topics.getInstance().getTopic(topic);
  }

  public async emitRepeatedTopic<T extends JsonObject = JsonObject>(
    topic: TopicName,
    data?: T,
    context?: EmittedJobContext,
    repeat?: EmittedJobRepeat
  ): Promise<EmittedJob> {
    const topicQueue = this.getTopicQueue(topic);
    const repeatableJobs = await topicQueue.getRepeatableJobs();

    // Ensure only one repatable job per name exists in bull queue leaving jobs that are identical.
    await forEachLimit(repeatableJobs, 5, async (job) => {
      if (job.name === topic) {
        if (job.cron && job.cron !== (repeat as CronRepeatOptions)?.cron) {
          await topicQueue.removeRepeatableByKey(job.key);
        }
        if (job.every && job.every !== (repeat as EveryRepeatOptions)?.every) {
          await topicQueue.removeRepeatableByKey(job.key);
        }
      }
    });

    return this.emitTopic({ topic, data, context, jobOptions: { repeat } });
  }
}
