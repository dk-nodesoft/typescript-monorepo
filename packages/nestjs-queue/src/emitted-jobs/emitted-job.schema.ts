import type { MongooseSelectInternal } from '@dk-nodesoft/nestjs-mongoose';
import { getModels } from '@dk-nodesoft/nestjs-mongoose';
import { createCuid } from '@dk-nodesoft/ts-utils';
import type { DynamicModule } from '@nestjs/common';
import { Schema } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import type { EmittedJob } from './emitted-job.types';
import { EmittedJobStatus } from './emitted-job.types';

export const EmittedJobSchema = new Schema<EmittedJob>(
  {
    cuid: { type: 'string', default: createCuid },
    queue: { type: 'string', required: true },
    topic: { type: 'string', required: true },
    data: { type: Schema.Types.Mixed, required: false },
    status: {
      type: 'string',
      enum: EmittedJobStatus,
      default: EmittedJobStatus.Processing
    },
    hash: { type: 'string', required: true },

    repeat: { type: Schema.Types.Mixed, required: false },

    context: {
      requestId: { type: 'string', default: createCuid },
      userId: { type: 'string', default: '*SYSTEM' }
    },

    createdAt: { type: Date, default: (): Date => new Date() },
    startedAt: { type: Date, required: false },
    endedAt: { type: Date, required: false },

    error: {
      message: { type: 'string', required: false },
      stack: { type: 'string', required: false }
    },

    schemaVersion: { type: 'string', default: '8', select: false },
    deleteAt: { type: Date, required: false }
  },
  {
    versionKey: false
  }
);

EmittedJobSchema.plugin(mongooseLeanVirtuals);

EmittedJobSchema.index({ topic: 1 }, { unique: false });
EmittedJobSchema.index(
  { topic: 1, endedAt: -1 },
  { partialFilterExpression: { endedAt: { $exists: true } }, unique: false }
);
EmittedJobSchema.index({ hash: 1 }, { unique: false });
EmittedJobSchema.index(
  { deleteAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { deleteAt: { $exists: true } }, unique: false }
);

const select: MongooseSelectInternal<EmittedJob> = {
  _id: 1,
  cuid: 1,
  context: 1,
  data: 1,
  topic: 1,
  status: 1,
  error: 1,
  progress: 1,
  queue: 1,
  repeat: 1,
  hash: 1,
  startedAt: 1,
  endedAt: 1,
  createdAt: 1,
  deleteAt: 1,
  schemaVersion: 1
};

export const EMITTED_JOBS = { name: 'EmittedJob', schema: EmittedJobSchema, select };

export const registerEmittedJobModel = (): DynamicModule =>
  getModels([{ name: EMITTED_JOBS.name, schema: EMITTED_JOBS.schema }]);
