export const getUndefined = (): undefined => {
  return undefined;
};

export const getBoolean = (): boolean => {
  const values = [true, false, Boolean(0), Boolean(1)];
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

export const getNumber = (): number => {
  const values = [42, 3.14, Infinity, Number('42')];
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

export const getString = (): string => {
  const values = ['str', String(42)];
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

export const getBigInt = (): bigint => {
  const values = [42n, BigInt('42')];
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

export const getSymbol = (): symbol => {
  return Symbol('symbol');
};
