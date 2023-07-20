/* eslint-disable tsdoc/syntax */
import type { IdName, IdString, ObjectWithId, RepositoryInstance } from '@dk-nodesoft/base-types';
import type { Document, Model, SortOrder, Types } from 'mongoose';
import type { Merge, PartialDeep, StringKeyOf } from 'type-fest';

export type MongoId = IdString | Types.ObjectId;

export type IdNameInternal = '_id';
export type SelectNumber = 1;

export const ID_NAME_INTERNAL: IdNameInternal = '_id';

export type ObjectWithIdInternal = {
  [ID_NAME_INTERNAL]: IdString;
};

export type ObjectWithIdInternalOptional = PartialDeep<ObjectWithIdInternal>;

export type ReadOptions = {
  select?: string[];
  populate?: string[];
  lean?: boolean;
};

/**
 * the base mongoose repository instance type.
 *
 * ( abstract type and should only be used to create new types )
 */
export type MongooseInstance = RepositoryInstance;

/**
 * type util function - Creates a object type used for select in mongoose model find operations
 * @param T - the MongooseInstance type
 * @example MongooseSelectInstance<{ cuid: CuidString; p1: number; p2: string }>;
 * returns {
 *    cuid: SelectNumber;
 *    p1: SelectNumber;
 *    p2: SelectNumber;
 *  }
 */
export type MongooseSelectInstance<T extends MongooseInstance> = Record<StringKeyOf<T>, SelectNumber>;
export type MongooseInstanceUnpopulated = Record<string, Types.ObjectId | Types.ObjectId[]>;

/**
 * type util function - Creates a type without id and _id properties
 * @param T - the MongooseInstance type
 */
export type MongooseBase<T extends MongooseInstance> = Omit<T, IdName | IdNameInternal>;
export type MongooseUnpopulated<T extends MongooseInstance, U extends MongooseInstanceUnpopulated> = Merge<T, U>;
/**
 * type util function - Creates a type that extends mongoose Document and T
 * @param T - the MongooseInstance type
 * @returns Document & MongooseBase<T>
 */
export type MongooseDocument<T extends MongooseInstance> = Document & MongooseBase<T>;

/**
 * type util function - Creates a type that extends the mongoose Model
 * @param T - the MongooseInstance type
 * @return Model<MongooseDocument<T>>
 */
export type MongooseModel<T extends MongooseInstance> = Model<MongooseDocument<T>>;

/**
 * type util function - Creates a type from T that includes internal _id property
 * ( and removes the external id property if present )
 * @param T - the MongooseInstance type
 */
export type MongooseInternal<T extends MongooseInstance> = Omit<T, IdName> & ObjectWithIdInternal;

/**
 * type util function - Creates a type from T that includes the external id property
 * ( and removes the internal _id property if present )
 * @param T - the MongooseInstance type
 */
export type MongooseExternal<T extends MongooseInstance> = Omit<T, IdNameInternal> & ObjectWithId;

/**
 * type util function - Get the select fields literal types for T + InternalId.
 * @param T - the MongooseInstance type
 * @example 'cuid' | '_id' | ...
 */
export type MongooseSelectFields<T extends MongooseInstance> = StringKeyOf<MongooseBase<T>>;

/**
 * type util function - Creates a object type used for select in mongoose model find operations
 * @param T - the MongooseInstance type
 * @example MongooseSelectInternal<{ cuid: CuidString; p1: number; p2: string }>;
 * returns {
 *    _id?: 0 | SelectNumber;
 *    cuid?: SelectNumber;
 *    p1?: SelectNumber;
 *    p2?: SelectNumber;
 *  }
 */
export type MongooseSelectInternal<T extends MongooseInstance> = PartialDeep<
  { _id?: 0 | 1 } & Record<MongooseSelectFields<T>, SelectNumber>
>;

/**
 * type util function - Creates a object type used for select in mongoose model find operations
 * @param T - the MongooseInstance type
 * @example MongooseSelectExternal<{ cuid: CuidString; p1: number; p2: string }>;
 * returns {
 *    id?: 0 | SelectNumber;
 *    cuid?: SelectNumber;
 *    p1?: SelectNumber;
 *    p2?: SelectNumber;
 *  }
 */
export type MongooseSelectExternal<T extends MongooseInstance> = PartialDeep<
  { id?: 0 | 1 } & Record<MongooseSelectFields<T>, SelectNumber>
>;

/**
 * type util function - Creates a new object type that sets all properties but _id to optional
 * @param T - the MongooseInstance type
 * @example MongooseOptionalInternal<{ cuid: CuidString; p1: number; p2: string }>;
 * returns {
 *    _id: IdString;
 *    cuid?: CuidString;
 *    p1?: number;
 *    p2?: string;
 *  }
 */
export type MongooseOptionalInternal<T extends MongooseInstance> = ObjectWithIdInternal & PartialDeep<T>;

/**
 * type util function - Creates a new object type that sets all properties but id to optional
 * @param T - the MongooseInstance type
 * @example MongooseOptionalxternal<{ cuid: CuidString; p1: number; p2: string }>;
 * returns {
 *    id: IdString;
 *    cuid?: CuidString;
 *    p1?: number;
 *    p2?: string;
 *  }
 */
export type MongooseOptionalxternal<T extends MongooseInstance> = ObjectWithId & PartialDeep<T>;

/**
 *type util function - Creates a new object type user for sorting. Sets all properties to optional
 */
export type MongooseSortInternal<T extends MongooseInstance> = { _id?: SortOrder } & { [P in keyof T]?: SortOrder };
