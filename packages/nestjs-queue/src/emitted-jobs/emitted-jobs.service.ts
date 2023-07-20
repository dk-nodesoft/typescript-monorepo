import { internalToExternalId } from '@dk-nodesoft/nestjs-mongoose';
import { forEachLimit } from '@dk-nodesoft/ts-utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery } from 'mongoose';
import { Model } from 'mongoose';
import createHash from 'object-hash';
import { Topics } from '../topics/topics';
import type { TopicName } from '../types';
import type { CreateEmittedJobDto } from './dtos';
import { EMITTED_JOBS } from './emitted-job.schema';
import type { EmittedJob, EmittedJobDocument, EmittedJobInternal, EmittedJobRepeat } from './emitted-job.types';
import { EmittedJobStatus } from './emitted-job.types';

@Injectable()
export class EmittedJobsService {
  private readonly logger = new Logger(EmittedJobsService.name);

  constructor(@InjectModel(EMITTED_JOBS.name) private readonly emittedJobModel: Model<EmittedJobDocument>) {}

  public async createEmittedJob(
    emittedJobDto: CreateEmittedJobDto,
    queue: string,
    deleteAt: Date,
    repeat?: EmittedJobRepeat
  ): Promise<EmittedJob> {
    const status = repeat ? EmittedJobStatus.Waiting : EmittedJobStatus.Processing;
    const hash = createHash({ topic: emittedJobDto.topic, data: emittedJobDto.data, queue });

    const _deleteAt = repeat ? undefined : deleteAt;

    // If repeat is set, see if we already have an entry on the emittedjobs collection
    if (repeat) {
      const repeatDoc = await this.emittedJobModel
        .findOne({ topic: emittedJobDto.topic, repeat: { $exists: true } })
        .lean({ virtuals: true });
      if (repeatDoc) {
        return repeatDoc;
      }
    }

    const rec = await this.emittedJobModel.create({
      ...emittedJobDto,
      queue,
      repeat,
      status,
      hash,
      deleteAt: _deleteAt
    });

    const internal = await this.emittedJobModel
      .findOne({ _id: rec._id })
      .select(EMITTED_JOBS.select)
      .lean<EmittedJobInternal>({ virtuals: true });

    return internalToExternalId<EmittedJob>(internal);
  }

  public async setFailed(filter: FilterQuery<EmittedJobDocument>, result?: any): Promise<void> {
    const message = result?.message || 'Unknown error occurred';
    const stack = result?.stack || '';

    const status = EmittedJobStatus.Failed;
    const endedAt = new Date();
    const error = { message, stack };

    await this.emittedJobModel.updateMany(filter, {
      status,
      endedAt,
      error,
      deleteAt: undefined // In the case of failed we remove the deleteAt so someone can take care of failed!
    });
  }

  public async setWaiting(filter: FilterQuery<EmittedJobDocument>): Promise<void> {
    const status = EmittedJobStatus.Waiting;
    await this.emittedJobModel.updateMany(filter, {
      status
    });
  }

  public async setActive(filter: FilterQuery<EmittedJobDocument>): Promise<void> {
    const startedAt = new Date();

    if (filter._id) {
      await this.emittedJobModel.updateOne(filter, {
        startedAt
      });
    } else {
      await this.emittedJobModel.updateMany(filter, {
        startedAt
      });
    }

    this.logger.debug({ startedAt }, 'Successfully updated startedAt - %o - %s', filter, startedAt.toJSON());
  }

  public async setSuccess(filter: FilterQuery<EmittedJobDocument>): Promise<void> {
    const status = EmittedJobStatus.Success;
    const endedAt = new Date();

    if (filter._id) {
      await this.emittedJobModel.updateOne(filter, {
        status,
        endedAt
      });
    } else {
      await this.emittedJobModel.updateMany(filter, {
        status,
        endedAt
      });
    }

    this.logger.debug('Successfully set status to success - %o - %s - %s', filter, status, endedAt.toJSON());
  }

  public async setSkipped(filter: FilterQuery<EmittedJobDocument>): Promise<void> {
    const status = EmittedJobStatus.Skipped;
    const endedAt = new Date();

    await this.emittedJobModel.updateMany(filter, {
      status,
      endedAt
    });

    this.logger.debug('Successfully set status to skipped - %o - %s - %s', filter, status, endedAt.toJSON());
  }

  public async cleanUp(): Promise<void> {
    const topicsInstance = Topics.getInstance();
    const topics = topicsInstance.getTopics();

    this.logger.log('Start cleaning up emitted jobs');

    // Mark documents ready for deletion by setting deletaAt (TTL index will take care of the rest)
    await forEachLimit(topics, 1, async (topic: TopicName): Promise<void> => {
      const cleanUpAfter = topicsInstance.getTopic(topic).cleanUpAfter;
      const deleteAt = new Date(Date.now() - cleanUpAfter * 24 * 60 * 60 * 1000);
      const query = {
        topic,
        endedAt: { $lte: deleteAt },
        deleteAt: { $exists: false },
        status: { $in: [EmittedJobStatus.Success, EmittedJobStatus.Skipped] }
      };

      const res = await this.emittedJobModel.updateMany(query, { deleteAt });
      this.logger.log('Successfully marked %i documents of topic %s ready for deletion', res.modifiedCount, topic);
    });

    this.logger.log('Done cleaning up emitted jobs');
  }
}
