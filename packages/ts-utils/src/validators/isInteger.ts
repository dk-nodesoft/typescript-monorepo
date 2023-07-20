import { isNumber } from '../typeguards/isNumber';

export const isInteger = <U>(term: number | U): term is number => {
  return isNumber(term) && Number.isInteger(term);
};
