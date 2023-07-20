/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Checks if `obj` is an array like object.
 *
 * Object is considered an arrayLike if iterator is present.
 *
 * @since 1.1.1
 * @category Typeguards
 * @param {*} obj The object to check.
 * @returns {boolean} Returns `true` if `value` is array like, else `false`.
 * @example
 * ´´´ts
 *
 * isArrayLike(null)
 * // => false
 *
 * isArrayLike(true)
 * // => false
 *
 * isArrayLike(1)
 * // => false
 *
 * isArrayLike([1, 2, 3])
 * // => true
 *
 * isArrayLike('abc')
 * // => true
 *
 * isArrayLike({ 'a': 1 })
 * // => false
 * ´´´
 */
export const isArrayLike = <T = void>(obj: any): obj is ArrayLike<T> =>
  obj != null && typeof obj[Symbol.iterator] === 'function';
