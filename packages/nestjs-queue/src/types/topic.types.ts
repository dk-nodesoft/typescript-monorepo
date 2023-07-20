import type { Data } from '@dk-nodesoft/base-types';
import type { JobOptions } from 'bull';
import type { CreateEmittedJobDto, EmittedJobContext } from '../emitted-jobs';

export type TopicData = Data;
export type TopicName = string;
export type QueueName = string;

export type TopicPayload<T extends TopicData = TopicData> = {
  data: T;
  context: EmittedJobContext;
  emittedJobId: string;
};

export type TransformPayloadFn<T extends TopicData = TopicData, U extends TopicData = T> = (
  dto: CreateEmittedJobDto<T>
) => U;
export type SkipFilterFn<T extends TopicData = TopicData> = (dto: CreateEmittedJobDto<T>) => boolean;

export type TopicOptions = {
  jobOptions?: JobOptions;

  transformPayload?: TransformPayloadFn;
  skipFilter?: SkipFilterFn;
  /**
   * cleanUpAfter: number of days after which the job entry will be removed from emittedjobs collection. If job has been successfully executed.
   * Default: 30 days.
   */
  cleanUpAfter?: number;
};

export type Topic<T extends TopicData = TopicData, U extends TopicData = TopicData> = {
  topic: TopicName;
  queue: QueueName;
  jobOptions: JobOptions;
  transformPayload: TransformPayloadFn<T, U>;
  skipFilter: SkipFilterFn<T>;
  cleanUpAfter: number;
};
