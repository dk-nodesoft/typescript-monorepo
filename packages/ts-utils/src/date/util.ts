import { isNumber, isString } from '../typeguards';

/**
 * get time from "now" as a Date.
 * @param ms - time to add to "now" in milliseconds
 * @returns Date
 * @example
 * ```
 * // now = Tue Feb 06 2023 09:27:06 GMT+0100
 * // 86400000 = 24 hours in milliseconds
 * const result = getDateFromNow(86400000);
 * console.log(result);
 * // result = Tue Feb 07 2023 09:27:06 GMT+0100
 * ```
 */
export const getDateFromNow = (ms: number | undefined): Date =>
  !isNumber(ms) || ms === 0 ? new Date() : new Date(Date.now() + ms);

/**
 * get time from "now" as a Date.
 * @param ms - time to add to "now" in milliseconds
 * @returns Date
 * @throws Error - if ms is not a number
 * @example
 * ```
 * // now = Tue Feb 06 2023 09:27:06 GMT+0100
 * // 86400000 = 24 hours in milliseconds
 * const result = getDateFromNow(86400000);
 * console.log(result);
 * // result = Tue Feb 07 2023 09:27:06 GMT+0100
 * ```
 */
export const getDateFromNowStrict = (ms: number | undefined): Date => {
  if (!isNumber(ms)) {
    throw new Error(`ms(${ms}) is not a number!`);
  }

  return getDateFromNow(ms);
};

/**
 *
 * @param yy - string/number from "00"/0 to "99"/99
 * @returns number
 * @example
 * ```
 * console.log(yyToFullYear(25));
 * // 2025
 * ```
 */
export const yyToFullYear = (yy: string | number): number => {
  let yyString = isString(yy) ? yy : `${yy}`;

  if (yyString.length === 1) {
    yyString = '0' + yyString;
  }

  const firstTwo = `${new Date().getFullYear()}`.substring(0, 2);

  return parseInt(firstTwo + yyString);
};

/**
 * convert a string in the format mm/yy or mm-yy to a Date.
 * @param value - date in format typically used for expiration date on credit cards
 * @returns Date
 * @example
 * ```
 * const result = mmyyToDate('11/25');
 * console.log(result);
 * // result = Sat Nov 01 2025 01:00:00 GMT+0100
 * ```
 */
export const mmyyToDate = (value = ''): Date | null => {
  if (!value || !/^\d{1,2} ?[/-]? ?\d{1,2}$/.test(value)) {
    return null;
  }

  const split = value.split(/[/-]/);
  let month = split[0].trim();

  if (month.length) {
    month = '0' + month;
  }

  try {
    const monthNumber = parseInt(month);
    if (monthNumber > 12 || monthNumber < 1) {
      return null;
    }
  } catch (err) {
    return null;
  }

  const year = yyToFullYear(split[1].trim());
  return new Date(`${year}-${month}`);
};
