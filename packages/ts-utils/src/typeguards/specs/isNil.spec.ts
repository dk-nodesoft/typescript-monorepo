import { isNil } from '../isNil';

describe('isNil', () => {
  it.each([
    ['', false],
    [[], false],
    [{}, false],
    [undefined, true],
    [null, true],
    ['foo', false],
    [{ foo: 'bar' }, false],
    [['foo', 'bar'], false],
    [0, false],
    [false, false],
    [true, false],
    [new Date(), false]
  ])('when "%p" is given should return "%p"', (value, expected) => {
    expect(isNil(value)).toStrictEqual(expected);
  });
});
