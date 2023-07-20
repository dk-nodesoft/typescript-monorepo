import { stringToSafeInteger } from '..';

describe('stringToSafeInteger', () => {
  it('should work as expected', () => {
    expect(stringToSafeInteger('')).toStrictEqual(null);
    expect(stringToSafeInteger(10)).toStrictEqual(10);
    expect(stringToSafeInteger('10')).toStrictEqual(10);
    expect(stringToSafeInteger('32568888')).toStrictEqual(32568888);
    expect(stringToSafeInteger('10.2')).toStrictEqual(null);
    expect(stringToSafeInteger(null)).toStrictEqual(null);
    expect(stringToSafeInteger('-3')).toStrictEqual(-3);
    expect(stringToSafeInteger(undefined)).toStrictEqual(null);
    expect(stringToSafeInteger(null)).toStrictEqual(null);
    expect(stringToSafeInteger(false)).toStrictEqual(null);
    expect(stringToSafeInteger(NaN)).toStrictEqual(null);
  });
});
