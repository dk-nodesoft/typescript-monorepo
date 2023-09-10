// ONLY TEST

import type { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

export type MongoTestConnections = {
  systemConnection: DynamicModule;
  tenantConnection: DynamicModule;

  stop: () => Promise<void>;
};
export const setupMongoMemoryServer = async (
  namespace: string,
  connectionName: string
): Promise<MongoTestConnections> => {
  const systemConnection = await MongooseModule.forRootAsync({
    useFactory: async () => {
      const uri = process.env['__TEST_MONGO_SYSTEM_INSTANCE_URI'] + '/' + namespace;
      return {
        uri
      };
    }
  });

  const tenantConnection = MongooseModule.forRootAsync({
    useFactory: async () => {
      const uri = process.env['__TEST_MONGO_TENANT_INSTANCE_URI'] + '/' + namespace;
      return {
        uri
      };
    },
    connectionName
  });

  return {
    systemConnection,
    tenantConnection,
    stop: async (): Promise<void> => {
      console.log('TODO: remove this call from tests');
    }
  };
};
