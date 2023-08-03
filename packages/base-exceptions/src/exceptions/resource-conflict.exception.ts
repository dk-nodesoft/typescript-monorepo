import type { BaseExceptionDetails } from '../base.exception';
import { BaseException } from '../base.exception';

export class ResourceConflictException extends BaseException {
  constructor(details: BaseExceptionDetails, cause?: Error) {
    super({ details, cause });
  }
}
