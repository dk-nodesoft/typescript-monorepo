import { BaseException, BaseExceptionDetails } from '../base.exception';

export class ResourceNotFoundException extends BaseException {
  constructor(details: BaseExceptionDetails, cause?: Error) {
    super({ details, cause });
  }
}
