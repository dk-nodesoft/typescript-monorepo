import type { BaseExceptionDetails } from '../base.exception';
import { BaseException } from '../base.exception';

export class ResourceNotFoundException extends BaseException {
  constructor(details: BaseExceptionDetails, cause?: Error) {
    super({ details, cause });
  }
}
