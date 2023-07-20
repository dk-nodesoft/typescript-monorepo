/* eslint-disable sonarjs/no-small-switch */
import type { Message } from '@dk-nodesoft/base-types';
import { ExceptionType, MessagesService, SystemMessage } from '@dk-nodesoft/base-types';
import { get, isInteger, isNumber } from '@dk-nodesoft/ts-utils';
import { ConflictException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

export type MongoErrorCode = number;

export const MONGODB_RESOURCE_CONFLICT = 11000;
export const MONGO_ERROR_CODE_DUPLICATE_KEY = 11000;

export const isMongoServerError = (error: unknown): error is MongoServerError => error instanceof MongoServerError;
export const isMongoDuplicateKeyError = (error: unknown): boolean =>
  isMongoServerError(error) && error.code === MONGO_ERROR_CODE_DUPLICATE_KEY;

const errorTypeMap: { [key: number]: ExceptionType } = {
  [MONGODB_RESOURCE_CONFLICT]: ExceptionType.resource_conflict_error
};

const formatConflictMessage = (err: MongoServerError): Message => {
  const messageService: MessagesService = MessagesService.getInstance();
  const { keyValue } = err;
  const params = { ...keyValue };
  return messageService.getMessage(SystemMessage.RESOURCE_CONFLICT, params);
};

const errorMessageFormat: Record<string, (err: MongoServerError) => Message> = {
  [MONGODB_RESOURCE_CONFLICT]: formatConflictMessage
};

export const getMongoServerErrorCode = (error: MongoServerError): MongoErrorCode | null => {
  const code = get(error, 'code');
  return isNumber(code) && isInteger(code) ? code : null;
};

export const mongoToMessage = (err: MongoServerError): Message => {
  if (isMongoServerError(err)) {
    const code = getMongoServerErrorCode(err);

    if (code && errorMessageFormat[code]) {
      return errorMessageFormat[code](err);
    }
  }

  throw new Error('error is not a instance of MongoServerError');
};

export const mongoToErrorType = (err: unknown): string | null => {
  if (!isMongoServerError(err)) {
    return null;
  }

  const code = getMongoServerErrorCode(err);

  return code && errorTypeMap[code] ? errorTypeMap[code] : null;
};

export const mongoToHttpStatusCode = (err: unknown): number => {
  if (!isMongoServerError(err)) {
    return 0;
  }

  const code = getMongoServerErrorCode(err);

  switch (code) {
    case MONGODB_RESOURCE_CONFLICT:
      return HttpStatus.CONFLICT;
    default:
      return 0;
  }
};

export const throwMongoError = (err: unknown): void => {
  if (isMongoServerError(err)) {
    const errorType = mongoToErrorType(err);

    switch (errorType) {
      case ExceptionType.resource_conflict_error:
        throw new ConflictException(mongoToMessage(err));
      default:
        throw new InternalServerErrorException(mongoToMessage(err));
    }
  }

  throw err;
};
