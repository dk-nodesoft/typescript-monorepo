export const isDate = <U>(term: Date | U): term is Date => {
  return term instanceof Date;
};
