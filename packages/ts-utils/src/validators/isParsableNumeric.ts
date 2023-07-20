import { isNonEmptyString } from './isNonEmptyString';

export const isParsableNumeric = (v: unknown): v is number | string => {
  if (typeof v === 'number' && !Number.isNaN(v)) {
    return true;
  }
  if (!isNonEmptyString(v)) {
    return false;
  }
  return !Number.isNaN(Number.parseInt(v, 10) || Number.isNaN(Number.parseFloat(v)));
};
