import { isInteger } from './isInteger';

export const isNonNegativeInteger = <U>(term: number | U): term is number => {
  return isInteger(term) && term >= 0;
};
