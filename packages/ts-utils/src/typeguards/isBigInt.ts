export const isBigInt = <U>(term: bigint | U): term is bigint => {
  return typeof term === 'bigint';
};
