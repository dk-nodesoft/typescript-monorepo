import { isNumber } from '../isNumber';
import { getBigInt, getBoolean, getNumber, getString, getSymbol, getUndefined } from './utitlities';

describe('Typeguard - isNumber', () => {
  it.each([
    [getUndefined(), false],
    [getBoolean(), false],
    [getNumber(), true],
    [getString(), false],
    [getBigInt(), false],
    [getSymbol(), false]
  ])('when %p is given, should return %p', (v, expected) => {
    expect(isNumber(v)).toStrictEqual(expected);
  });
});
