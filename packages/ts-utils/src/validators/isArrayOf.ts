import { forEach } from 'lodash';
import { isArray } from '../typeguards';
import type { TypeGuard } from '../utility-types/TypeGuard';

/**
 * Validates if instance is Array<U>
 * @param array - the instance to validate as Array<U>
 * @param typeguard - the typeguard for U
 * @returns boolean
 */
export const isArrayOf = <U>(array: unknown, typeguard: TypeGuard<U>): array is U[] => {
  if (!isArray(array)) {
    return false;
  }

  let is = true;

  forEach(array, (item) => {
    if (!typeguard(item)) {
      is = false;
      return false;
    }
  });

  return is;
};
