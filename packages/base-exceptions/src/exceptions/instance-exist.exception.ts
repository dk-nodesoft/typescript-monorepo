import httpStatus from 'http-status/dist';
import type { BaseExceptionDetails } from '../base.exception';
import { BaseException } from '../base.exception';

export class InstanceExistException extends BaseException {
  constructor(details: BaseExceptionDetails) {
    super(BaseException.createOptions({ details }, { statusCode: httpStatus.UNPROCESSABLE_ENTITY }));
  }
}
