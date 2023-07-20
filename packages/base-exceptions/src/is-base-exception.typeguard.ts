import { BaseException } from './base.exception';

export const isBaseException = (v: unknown): v is BaseException => {
  return v instanceof BaseException;
};
