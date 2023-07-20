import { isEmpty } from '../isEmpty';

describe('isEmpty', () => {
  it.each([
    ['', true],
    [[], true],
    [{}, true],
    [undefined, true],
    [null, true],
    ['foo', false],
    [{ foo: 'bar' }, false],
    [['foo', 'bar'], false],
    [0, false],
    [false, false],
    [true, false],
    [new Date(), false]
  ])('when %p is given should return %p', (value, expected) => {
    expect(isEmpty(value)).toStrictEqual(expected);
  });
});
