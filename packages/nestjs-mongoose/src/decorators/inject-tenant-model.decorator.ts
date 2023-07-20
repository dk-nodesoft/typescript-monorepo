import { InjectModel } from '@nestjs/mongoose';
import { DB_TENANT } from '../constants';

export const InjectTenantModel = (modelName: string) => {
  return InjectModel(modelName, DB_TENANT);
};
