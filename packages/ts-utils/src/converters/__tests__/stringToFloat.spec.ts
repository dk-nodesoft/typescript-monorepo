import { stringToFloat } from '../stringToFloat';

describe('stringToFloat', () => {
  it.each([
    [10, 10],
    ['10.2345', 10.2345],
    ['.2', 0.2],
    ['-10.234', -10.234],
    [null, null],
    [NaN, null],
    [false, null],
    [undefined, null]
  ])('when "%p" is given should return "%p"', (value, expected) => {
    expect(stringToFloat(value)).toStrictEqual(expected);
  });
});
