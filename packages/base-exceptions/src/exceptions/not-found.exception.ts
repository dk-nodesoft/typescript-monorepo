import type { MessageParameters, MessagePrimitive } from '@dk-nodesoft/base-types';
import httpStatus from 'http-status/dist';
import type { BaseExceptionDetails } from '../base.exception';
import { BaseException } from '../base.exception';

export type NotFoundExceptionOptions = {
  message: MessagePrimitive;
  parameters?: MessageParameters;
  details?: BaseExceptionDetails;
  cause?: Error;
};

export class NotFoundException extends BaseException {
  constructor(messageOrOptions: MessagePrimitive | NotFoundExceptionOptions) {
    super(BaseException.createOptions(messageOrOptions, { statusCode: httpStatus.NOT_FOUND }));
  }
}
