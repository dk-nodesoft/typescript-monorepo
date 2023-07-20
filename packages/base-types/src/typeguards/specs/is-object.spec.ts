/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isDataOptional } from '../object';

describe('util/object.ts', () => {
  describe('isDataOptional', () => {
    it('should be defined', () => {
      expect(isDataOptional).toBeDefined();
    });

    it.each([
      [{ p: 1, p2: undefined, p3: 'value', p4: '' }, true],
      [{ p: null, p2: undefined, p3: 'value', p4: {}, p5: [] }, true],
      [{ p: null, p2: function () {}, p3: 'value', p4: {}, p5: [] }, false],
      [{ p: null, p2: () => {}, p3: 'value', p4: {}, p5: [] }, false]
    ])('when "%p" is given should return "%p"', (value, expected) => {
      expect(isDataOptional(value)).toStrictEqual(expected);
    });
  });
});
