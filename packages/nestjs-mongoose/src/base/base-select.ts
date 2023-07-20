import type { MongooseInstance, MongooseSelectInternal } from '../types';

export const baseSelect: MongooseSelectInternal<MongooseInstance> = {
  _id: 0,
  cuid: 1
};
