import { isBoolean } from '../typeguards/isBoolean';
import { isString } from '../typeguards/isString';

const fromString = (fld: unknown): boolean | null => {
  if (isString(fld) && fld.length > 0) {
    const v = fld.charAt(0).toLowerCase();
    return v === 't' || v === 'y' || v === 'j' || v === '1' || false;
  }
  return null;
};

/**
 * Cast from any type to boolean using the following rules
 * boolean true is true
 * number 1 is true
 * string[0] ty1j is true
 * @param {*} v The value to cast
 */
export const toBoolean = (v: unknown): boolean => {
  if (isBoolean(v)) {
    return v;
  }

  return v == 1 || fromString(v) || false;
};
