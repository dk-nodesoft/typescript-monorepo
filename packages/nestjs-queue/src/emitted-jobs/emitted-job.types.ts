import type { Data, ObjectWithId, RepositoryInstance } from '@dk-nodesoft/base-types';
import type { MongooseInternal } from '@dk-nodesoft/nestjs-mongoose';
import type { CronRepeatOptions, EveryRepeatOptions } from 'bull';
import type { Document } from 'mongoose';

export enum EmittedJobStatus {
  Processing = 'processing', // Initial state
  Failed = 'failed',
  Success = 'success',
  Skipped = 'skipped',
  Waiting = 'waiting'
}

export type EmittedJobId = string;

export type EmittedJobContext = {
  requestId?: string;
  userId?: string;
};

export type EmittedJobError = {
  message: string;
  stack: string;
};

export type EmittedJobRepeat = CronRepeatOptions | EveryRepeatOptions;

export type EmittedJob = RepositoryInstance &
  ObjectWithId & {
    queue: string;
    topic: string;
    data?: Data;
    repeat?: EmittedJobRepeat;
    context: EmittedJobContext;
    status: EmittedJobStatus;
    progress: number;
    hash: string;
    createdAt?: Date;
    startedAt?: Date;
    endedAt?: Date;
    error?: EmittedJobError;
    schemaVersion?: string;
    deleteAt?: Date;
  };

export type EmittedJobInternal = MongooseInternal<EmittedJob>;
export type EmittedJobDocument = EmittedJob & Document;
