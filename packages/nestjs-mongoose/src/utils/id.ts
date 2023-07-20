import type { IdString, ObjectWithId } from '@dk-nodesoft/base-types';
import { isString } from '@dk-nodesoft/ts-utils';
import { Types } from 'mongoose';
import type { SetOptional } from 'type-fest';
import { InvalidIdStringException, InvalidObjectIdException } from '../exceptions';
import type {
  IdNameInternal,
  MongoId,
  MongooseExternal,
  MongooseInstance,
  MongooseInternal,
  ObjectWithIdInternal
} from '../types';

/**
 * TypeGuard - Check if parameter is of type ObjectId
 * @param id - ObjectId to check
 * @returns true if parameter is og type ObjectId
 */
export const isObjectId = (id: unknown): id is Types.ObjectId => id instanceof Types.ObjectId;

/**
 * TypeGuard - Check if parameter is a valid IdString
 * @param id - IdString to check
 * @returns true if parameter is a valid IdString
 */
export const isIdString = (id: unknown): id is IdString => isString(id) && Types.ObjectId.isValid(id);

/**
 * TypeGuard - Check if parameter is an ObjectId or a a valid IdString
 * @param id - MongoId to check
 * @returns true if parameter is an ObjectId or a valid IdString.
 */
export const isMongoId = (id: unknown): id is MongoId => isObjectId(id) || isIdString(id);

/**
 * TypeGuard - Check if parameter is a valid MongoId
 * @param id - MongoId to check
 * @returns true if parameter is a valid MongoId, otherwise throws an exception
 * @throws InvalidIdStringException
 */
export const isIdStrict = (id: unknown): id is MongoId => {
  if (!isObjectId(id) && !isIdString(id)) {
    throw new InvalidIdStringException(id);
  }
  return true;
};

/**
 * TypeGuard - Check if objects _id property is an ObjectId or a valid IdString
 * @param objectWithIdInternal - Object with an _id property
 * @returns true if _id property is an ObjectId or a valid IdString
 */
export const isObjectWithIdInternal = (objectWithIdInternal: unknown): objectWithIdInternal is ObjectWithIdInternal =>
  !!objectWithIdInternal && isMongoId((objectWithIdInternal as ObjectWithIdInternal)._id);

/**
 * TypeGuard - Check if objects id property is an ObjectId or a valid IdString
 * @param objectWithId - Object with an id property
 * @returns true if id property is an ObjectId or a valid IdString
 */
export const isObjectWithId = <U extends ObjectWithId = ObjectWithId>(objectWithId: unknown): objectWithId is U =>
  !!objectWithId && isMongoId((objectWithId as ObjectWithId).id);

/**
 * Converts MongoId to IdString
 * @param id - MongoId to convert
 * @returns MongoId as IdString or null if conversion failed.
 */
export const toIdString = (id: MongoId): IdString | null =>
  isIdString(id) ? id : isObjectId(id) ? id.toString() : null;

/**
 * Converts MongoId to ObjectId
 * @param id - MongoId to convert
 * @returns MongoId as ObjectId or null if conversion failed.
 */
export const toObjectId = (id: MongoId): Types.ObjectId | null =>
  isIdString(id) ? new Types.ObjectId(id) : isObjectId(id) ? id : null;

/**
 * Converts MongoId to IdString.
 * @param id - MongoId to convert
 * @returns MongoId or throws an exception
 * @throws InvalidIdStringException
 */
export const toIdStringStrict = (id: MongoId): IdString => {
  const IdString = toIdString(id);

  if (IdString === null) {
    throw new InvalidIdStringException(id);
  }

  return IdString;
};

/**
 * Converts MongoId to ObjectId.
 * @param id - MongoId to convert
 * @returns MongoId or throws an exception
 * @throws InvalidObjectIdException
 */
export const toObjectIdStrict = (id: MongoId): Types.ObjectId => {
  const objectId = toObjectId(id);

  if (objectId === null) {
    throw new InvalidObjectIdException(id);
  }

  return objectId;
};

/**
 * Convert property _id to id if present
 * @param internal - Object with property _id
 * @returns Object where _id is changed to id
 */
export const internalToExternalId = <U extends MongooseInstance>(internal: unknown): U => {
  // if the instance already has the id property or no _id (internal id) is present
  if (isObjectWithId<MongooseExternal<U>>(internal) || !isObjectWithIdInternal(internal)) {
    return internal as unknown as U;
  }

  const id = toIdStringStrict(internal._id);
  const optionalInternal = internal as unknown as SetOptional<MongooseInternal<U>, IdNameInternal>;
  delete optionalInternal._id;

  const external: unknown = {
    ...optionalInternal,
    id
  };

  return external as U;
};

/*
export const internalDocumentToExternal = (internal: unknown): void => {
  if (isObjectWithIdInternal(internal)) {
    internal[ID_NAME] = toIdStringStrict(internal[ID_NAME_INTERNAL]);
    delete (internal as unknown as SetOptional<ObjectWithIdInternal, IdNameInternal>)._id;
  }
  if (isArray(internal) || isObject(internal)) {
    forEach(internal, (sub) => {
      if (isArray(sub) || isObject(sub)) {
        internalDocumentToExternal(sub);
      }
    });
  }
};
*/
