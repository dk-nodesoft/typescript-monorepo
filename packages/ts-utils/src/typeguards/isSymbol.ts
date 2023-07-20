export const isSymbol = <U>(v: symbol | U): v is symbol => {
  return typeof v === 'symbol';
};
