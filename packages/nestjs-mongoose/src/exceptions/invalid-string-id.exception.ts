import { BaseException } from '@dk-nodesoft/base-exceptions';

export class InvalidIdStringException extends BaseException {
  constructor(id: unknown) {
    super({ details: `Invalid id string: "${id}"` });
  }
}
