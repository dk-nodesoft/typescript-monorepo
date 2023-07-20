/**
 * Checks if the given argument is a string. Only works for string primitives.
 *
 * @since 1.1.1
 * @category Typeguards
 * @param {*} term The value to check.
 * @returns {boolean} Returns `true` if `term` is a string, else `false`.
 * @example
 * ´´´ts
 * isString(null)
 * // => false
 *
 * isString("Foo bar")
 * // => true
 *
 * isString("42")
 * // => true
 *
 * isString([1, 2, 3])
 * // => false
 * ´´´
 */
export const isString = <U>(term: string | U): term is string => {
  return typeof term === 'string';
};
