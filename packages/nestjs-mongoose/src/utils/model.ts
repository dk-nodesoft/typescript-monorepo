import type { DynamicModule } from '@nestjs/common';
import type { ModelDefinition } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TENANT } from '../constants';
import { ID_NAME_INTERNAL, type MongooseInstance, type MongooseModel, type MongooseSelectInstance } from '../types';

export const createSelectExcludeDefaults: string[] = ['_id', 'createdAt', 'updatedAt', 'schemaVersion', '__v'];

export const createSelectFromModel = <T extends MongooseInstance>(
  model: MongooseModel<T>,
  exclude: string[] = createSelectExcludeDefaults
): MongooseSelectInstance<T> => {
  const select: Partial<MongooseSelectInstance<T>> = {};

  model.schema.eachPath((path) => {
    if (exclude.indexOf(path) === -1) {
      select[path as keyof MongooseSelectInstance<T>] = 1;
    }
  });

  if (ID_NAME_INTERNAL in select) {
    select[ID_NAME_INTERNAL] = 0;
  }

  return select as MongooseSelectInstance<T>;
};

/**
 * Used for registering the schema in the system database.
 * @param definitions - Name and schema for model
 * @returns DynamicModule
 * @example
 * ```ts
 * // Function to register a model. Should be added to the schema definition file
 * export const registerConfigModel = (): DynamicModule => getModels([{ name: CONFIG.name, schema: ConfigSchema }]);
 *
 * // Use it in a module
 * const ConfigModel = registerConfigModel();
 * @Module({
 *   imports: [ConfigModel],
 *   ...
 * })
 * ```
 */
export const getModels = (definitions: ModelDefinition[]): DynamicModule => MongooseModule.forFeature(definitions);

/**
 * Used for registering the schema in the tenant database.
 * @param definitions - Name and schema for model
 * @returns DynamicModule
 * @example
 * ```ts
 * // Function to register a model. Should be added to the schema definition file
 * export const registerUserModel = (): DynamicModule => getTenantModels([{ name: USER.name, schema: UserSchema }]);
 *
 * // Use it in a module
 * const UserModel = registerUserModel();
 * @Module({
 *   imports: [UserModel],
 *   ...
 * })
 * ```
 */
export const getTenantModels = (definitions: ModelDefinition[]): DynamicModule =>
  MongooseModule.forFeature(definitions, DB_TENANT);
