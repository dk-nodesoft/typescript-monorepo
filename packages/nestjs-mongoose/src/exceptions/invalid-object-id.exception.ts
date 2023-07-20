import { BaseException } from '@dk-nodesoft/base-exceptions';

export class InvalidObjectIdException extends BaseException {
  constructor(id: unknown) {
    super({ details: `invalid id object: "${id}"` });
  }
}
