/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isFunction } from '../';

const testFunction = () => {
  return true;
};

function testFn() {
  return true;
}

describe('Typeguard - isFunction', () => {
  it.each([
    [testFunction, true],
    [testFn, true],
    [{}, false],
    [[], false],
    [new Date(), false],
    [undefined, false],
    [null, false]
  ])('when "%p" is given, should return %p', (v, expected) => {
    expect(isFunction(v)).toStrictEqual(expected);
  });
});
