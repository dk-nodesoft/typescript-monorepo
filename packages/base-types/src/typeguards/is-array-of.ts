import { forEach, isArray } from '@dk-nodesoft/ts-utils';
import type { TypeguardFunction } from '../types';

/**
 * Validates if instance is Array<U>
 * @param array - the instance to validate as Array<U>
 * @param typeguard - the typeguard for U
 * @returns boolean
 */
export const isArrayOf = <U>(array: unknown, typeguard: TypeguardFunction<U>): array is U[] => {
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

/**
 * Creator function, to create a array typeguard for an Type ( U )
 * @param typeguard - the typeguard for U
 * @returns TypeguardFunction<U>
 */
export const createArrayTypeguard = <U>(typeguard: TypeguardFunction<U>): ((array: unknown) => array is U[]) => {
  return (array): array is U[] => isArrayOf<U>(array, typeguard);
};
