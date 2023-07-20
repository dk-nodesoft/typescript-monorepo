/* eslint-disable sonarjs/no-duplicate-string */
import {
  isEmpty,
  isHttpStatusCode,
  isIsoDateString,
  isNonEmptyString,
  isParsableNumeric,
  isParsableSafeInteger,
  isPresent
} from '../';

describe('Validators tests', () => {
  describe('isEmpty Set and Map - not supported', () => {
    it.each([
      [new Map(), false],
      [new Set(), false],
      [new Set(['foo', 'bar']), false],
      [new Map([['foo', 'bar']]), false]
    ])('when "%p" is given should return "%p"', (value, expected) => {
      expect(isEmpty(value)).toStrictEqual(expected);
    });
  });

  describe('isNonEmptyString', () => {
    it('should trim by default', () => {
      expect(isNonEmptyString('  ')).toStrictEqual(isNonEmptyString(''));
    });
    describe('when trim === true (default)', () => {
      it('should work as expected', () => {
        expect(isNonEmptyString('cool')).toBeTruthy();
        expect(isNonEmptyString(1)).toBeFalsy();
        expect(isNonEmptyString('  ')).toBeFalsy();
        expect(isNonEmptyString('')).toBeFalsy();
        expect(isNonEmptyString(null)).toBeFalsy();
        expect(isNonEmptyString({})).toBeFalsy();
      });
    });
    describe('when trim === false', () => {
      it('should work as expected', () => {
        expect(isNonEmptyString('cool ', false)).toBeTruthy();
        expect(isNonEmptyString('  ', false)).toBeTruthy();
      });
    });
  });
  describe('isParsableNumeric', () => {
    it.each([
      [10, true],
      ['100', true],
      ['-3', true],
      ['2.12', true],
      [NaN, false],
      [undefined, false],
      [false, false],
      [null, false],
      [{}, false],
      [[], false],
      [new Date(), false]
    ])('when "%p" is given should return "%b"', (value, expected) => {
      expect(isParsableNumeric(value)).toStrictEqual(expected);
    });
  });

  describe('isHttpStatusCode', () => {
    it.each([
      [200, true],
      [800, false],
      ['-3', false],
      [NaN, false],
      [undefined, false],
      [false, false],
      [null, false],
      [[], false],
      [new Date(), false]
    ])('when "%p" is given should return "%b"', (value, expected) => {
      expect(isHttpStatusCode(value)).toStrictEqual(expected);
    });
  });

  describe('isIsoDateString', () => {
    it('should return true for valid isoDate strings', () => {
      expect(isIsoDateString('2022-02-06T15:20:19.131Z')).toBeTruthy();
    });
    it('should return false for invalid isDate strings', () => {
      expect(isIsoDateString('2022-40-20T15:20:19.131Z')).toBeFalsy();
      expect(isIsoDateString(new Date())).toBeFalsy();
      expect(isIsoDateString(null)).toBeFalsy();
    });
  });

  describe('isParsableSafeInteger', () => {
    it.each([
      [10, true],
      [-10, true],
      ['10', true],
      ['-10', true],
      [Number.MAX_SAFE_INTEGER, true],
      [`${Number.MIN_SAFE_INTEGER}`, true],
      [BigInt(1), false],
      [0, true],
      ['0', true],
      ['0.0', false],
      [1.234, false],
      [false, false],
      [undefined, false],
      [null, false],
      [(): string => 'cool', false]
    ])('when "%p" is given, should return %p', (v, expected) => {
      expect(isParsableSafeInteger(v)).toStrictEqual(expected);
    });
  });

  describe('isPresent', () => {
    it('should return false when null or undefined', () => {
      expect(isPresent(null)).toBeFalsy();
      expect(isPresent(undefined)).toBeFalsy();
    });
    it('should return true when not null and not undefined', () => {
      expect(isPresent(false)).toBeTruthy();
      expect(isPresent(true)).toBeTruthy();
      expect(isPresent(NaN)).toBeTruthy();
      expect(isPresent('hello')).toBeTruthy();
      expect(isPresent(0)).toBeTruthy();
    });
  });
});
