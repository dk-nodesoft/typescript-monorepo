import { BaseException } from '@dk-nodesoft/base-exceptions';
import { isObject } from '@dk-nodesoft/ts-utils';

export class NoIdException extends BaseException {
  constructor(instance: unknown) {
    super({
      details: `Property _id or id not present in ${
        isObject(instance) ? JSON.stringify(instance) : '"' + instance + '"'
      }`
    });
  }
}
