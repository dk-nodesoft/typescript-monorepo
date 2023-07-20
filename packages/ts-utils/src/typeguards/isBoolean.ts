export const isBoolean = <U>(term: boolean | U): term is boolean => {
  return typeof term === 'boolean';
};
