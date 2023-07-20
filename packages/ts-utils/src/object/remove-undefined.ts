import { forEach, isArray, isObject } from 'lodash';
import { isUndefined } from '../typeguards';

export const removeUndefined = <U = unknown>(obj: unknown): U => {
  if (isArray(obj)) {
    forEach(obj, (value, index) => {
      if (typeof value === 'object' && value !== null) {
        removeUndefined(value);
      } else if (value === undefined) {
        obj.splice(index, 1);
      }
    });

    return obj as U;
  }

  if (isObject(obj)) {
    forEach(obj, (value, propName) => {
      if (typeof value === 'object' && value !== null) {
        removeUndefined(value);
      } else if (isUndefined(value)) {
        delete (obj as Record<string, unknown>)[propName];
      }
    });
  }

  return obj as U;
};
