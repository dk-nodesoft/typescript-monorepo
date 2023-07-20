import type { PropertyName } from 'lodash';
import { set } from 'lodash';
import { isFunction, isPlainObject } from '../typeguards';
import { isNotEmpty } from '../validators';

/**
 * Converts an array of objects into an object setting idProp as the key for each object
 * @param {Array} arr
 * @param {string} idProp
 * @param {Function} [fn]
 * @returns {Object}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const arrayToObject = <T = unknown>(arr: [T], idProp: string, fn: Function): {} => {
  const obj = {};

  arr.forEach((element: T, idx: number) => {
    if (isPlainObject(element)) {
      let convElement = element;

      if (isFunction(fn)) convElement = fn.call(this, element, idx, arr);

      const id = element[idProp] as PropertyName;
      if (isNotEmpty(id)) {
        set(obj, id, convElement);
      }
    }
  });

  return obj;
};
