import { toBoolean } from '../toBoolean';

describe('toBoolean', () => {
  it.each([
    [true, true],
    [false, false],
    [0, false],
    ['0', false],
    [1, true],
    ['1', true],
    ['', false],
    [undefined, false],
    ['Y', true],
    ['y', true],
    ['T', true],
    ['t', true],
    ['J', true],
    ['j', true],
    ['N', false],
    ['n', false]
  ])('when "%p" is given should return "%p"', (value, expected) => {
    expect(toBoolean(value)).toStrictEqual(expected);
  });
});
