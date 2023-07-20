import { isSafeInteger } from './isSafeInteger';

export const isHttpStatusCode = (v: unknown): v is number => {
  return isSafeInteger(v) && v < 600 && v >= 100;
};
