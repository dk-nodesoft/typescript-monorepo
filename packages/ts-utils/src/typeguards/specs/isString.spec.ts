import { isString } from '../';

describe('Typeguard - isString', () => {
  it.each([
    ['', true],
    ['foo', true],
    ['42', true],
    [{}, false],
    [{ name: 'seb' }, false],
    [new Date(), false],
    [false, false],
    [undefined, false],
    [null, false],
    [(): string => 'cool', false]
  ])('when %p is given, should return %p', (v, expected) => {
    expect(isString(v)).toStrictEqual(expected);
  });
});
