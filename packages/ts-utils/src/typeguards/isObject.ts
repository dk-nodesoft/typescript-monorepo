import { isNull } from './isNull';

export const isObject = <T extends object, U>(term: T | U): term is NonNullable<T> => {
  return !isNull(term) && typeof term === 'object';
};
