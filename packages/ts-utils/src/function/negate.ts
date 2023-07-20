/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-types */

/**
 *
 * @param func
 * @returns
 */
export const negate =
  (func: Function) =>
  (...args: any[]) =>
    !func(...args);
