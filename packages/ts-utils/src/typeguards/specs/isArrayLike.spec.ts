import { isArrayLike } from '..';

describe('Typeguard - isArrayLike', () => {
  it.each([
    [[], true],
    ['abc', true],
    [new Map(), true],
    [new Set(), true],
    [{ foo: 'bar' }, false],
    [new Date(), false],
    [undefined, false],
    [null, false],
    [0, false],
    [(): boolean => true, false],
    [{}, false]
  ])('when %p is given, should return %p', (v, expected) => {
    expect(isArrayLike(v)).toStrictEqual(expected);
  });
});
