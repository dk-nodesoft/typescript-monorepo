import { BaseException, BaseExceptionDetails } from '../base.exception';

export class ResourceConflictException extends BaseException {
  constructor(details: BaseExceptionDetails, cause?: Error) {
    super({ details, cause });
  }
}
