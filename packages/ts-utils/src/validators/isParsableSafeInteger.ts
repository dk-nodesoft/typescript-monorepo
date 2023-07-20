import { isSafeInteger } from './isSafeInteger';

export const isParsableSafeInteger = (v: unknown): v is number | string => {
  const value = typeof v === 'string' && /^-?\d+$/.test(v) ? Number.parseInt(v, 10) : v;
  return isSafeInteger(value);
};
