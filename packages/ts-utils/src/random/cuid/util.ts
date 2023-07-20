/* eslint-disable @typescript-eslint/no-var-requires */
import cuid2 from '@paralleldrive/cuid2';
import { isString } from '../../typeguards';
import { CUID_LENGTH } from './constants';
import { InvalidCuidException } from './invalid-cuid.exception';
import type { CuidString } from './types';

const validRegex = new RegExp(`^[a-z\\d]{${CUID_LENGTH}}$`);

const cuid = ((): (() => CuidString) => {
  return cuid2.init({ length: CUID_LENGTH });
})();

/**
 * Create a new unique cuid
 * @returns CuidString
 */
export const createCuid: () => CuidString = () => cuid();

/**
 * Validate that cuid is a string and a valid cuid string
 * @param cuid - the parameter to be validated
 * @returns boolean
 */
export const isCuidString = (cuid: unknown): cuid is CuidString => isString(cuid) && validRegex.test(cuid);
export const isCuidStringStrict = (cuid: unknown): cuid is CuidString => {
  if (isCuidString(cuid)) {
    return true;
  }

  throw new InvalidCuidException(cuid);
};
