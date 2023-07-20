import { isInteger } from './isInteger';

export const isNegativeInteger = <U>(term: number | U): term is number => {
  return isInteger(term) && term < 0;
};
