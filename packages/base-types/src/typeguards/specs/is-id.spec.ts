import { forEach } from '@dk-nodesoft/ts-utils';
import { ID_BYTE_LENGTH, isIdString } from '../is-id';
import { isIdParams } from '../object';

describe('util/is-id.ts', () => {
  it('should be defined', () => {
    expect(isIdString).toBeDefined();
    expect(isIdParams).toBeDefined();
  });

  const validIds = ['6357d00f52e65f18a42ee6e8'];
  const invalidIds = [undefined, null, '', 'xx', '6357d00f52e65f18a42ee6e8x', '6357d00f52e65f18a42ee6x'];

  it('should use correct byte length', () => {
    forEach(validIds, (id) => {
      expect(typeof id === 'string').toBe(true);
      expect(Buffer.byteLength(id)).toStrictEqual(ID_BYTE_LENGTH);
    });
  });

  it('should validate ids', () => {
    forEach(validIds, (id) => {
      expect(isIdString(id)).toBe(true);
    });
    forEach(invalidIds, (id) => {
      expect(isIdString(id)).toBe(false);
    });
  });

  it('should validate id params', () => {
    forEach(validIds, (id) => {
      expect(isIdParams({ id })).toBe(true);
    });
    forEach(invalidIds, (id) => {
      expect(isIdParams({ id })).toBe(false);
    });
  });
});
