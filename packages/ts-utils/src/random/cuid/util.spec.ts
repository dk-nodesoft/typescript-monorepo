import { init } from '@paralleldrive/cuid2';
import { CUID_LENGTH } from './constants';
import { createCuid, isCuidString } from './util';

describe('cuid util tests', () => {
  const generateCuids = (start = 1, end: number): string[] => {
    const cuids: string[] = [];
    let i = start;
    for (; i <= end; i++) {
      cuids.push(init({ length: i })());
    }
    return cuids;
  };

  const shouldFail = [
    ...generateCuids(1, CUID_LENGTH - 1),
    ...generateCuids(CUID_LENGTH + 1, CUID_LENGTH + 10),
    '',
    createCuid().replace(/[a-z\d]$/, 'æ'),
    createCuid().replace(/[a-z\d]$/, 'ø'),
    createCuid().replace(/[a-z\d]$/, 'å'),
    createCuid().replace(/[a-z\d]$/, '_')
  ];

  const shouldPass = [createCuid()];

  it.each([...shouldFail.map((cuid) => [cuid, false]), ...shouldPass.map((cuid) => [cuid, true])])(
    'isCuidString(%p) should return %p',
    (value, expected) => {
      expect(isCuidString(value)).toBe(expected);
    }
  );
});
