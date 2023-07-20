/* eslint-disable @typescript-eslint/no-explicit-any */

export const isPromiseLike = <T = void>(v: any): v is PromiseLike<T> => {
  return !!v && (typeof v === 'object' || typeof v === 'function') && typeof v.then === 'function';
};
