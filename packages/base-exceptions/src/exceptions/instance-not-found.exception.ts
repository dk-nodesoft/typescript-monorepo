import httpStatus from 'http-status';
import { BaseException, BaseExceptionDetails } from '../base.exception';

export class InstanceNotFoundException extends BaseException {
  constructor(details: BaseExceptionDetails) {
    super(BaseException.createOptions({ details }, { statusCode: httpStatus.UNPROCESSABLE_ENTITY }));
  }
}
