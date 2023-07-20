import { forEach, isDate, range } from 'lodash';
import { getDateFromNowStrict, mmyyToDate, yyToFullYear } from './util';

describe('date util tests', () => {
  const validyy = Array.from(Array(100).keys());
  const validmm = range(1, 13);

  const invalidDividers = ['|', '&', '!', '#'];
  const invalidyy = [...range(-10, 0), ...range(100, 100)];
  const invalidmm = [...range(-12, 1), ...range(13, 100)];

  describe('yyToFullYear', () => {
    it.each([...invalidyy.map((invalid) => [`${invalid}`, false]), ...validyy.map((valid) => [`${valid}`, true])])(
      '%p should return %p',
      (value, expected) => {
        expect(/^20\d{2}$/.test(`${yyToFullYear(value as string)}`)).toBe(expected);
      }
    );
  });

  describe('mmyyToDate', () => {
    const validmmyy = ((): string[] => {
      const dividers = ['-', '/'];
      const valid: string[] = [];

      forEach(dividers, (div) => {
        forEach(validmm, (mm) => {
          forEach(validyy, (yy) => {
            valid.push(`${mm}${div}${yy}`);
          });
        });
      });

      return valid;
    })();
    const invalidmmyy = ((): string[] => {
      const dividers = ['-', '/'];
      const invalid: string[] = [];

      forEach(invalidDividers, (div) => {
        forEach(validmm, (mm) => {
          forEach(validyy, (yy) => {
            invalid.push(`${mm}${div}${yy}`);
          });
        });
      });

      forEach(dividers, (div) => {
        forEach(invalidmm, (mm) => {
          forEach(validyy, (yy) => {
            invalid.push(`${mm}${div}${yy}`);
          });
        });
      });

      forEach(dividers, (div) => {
        forEach(validmm, (mm) => {
          forEach(invalidyy, (yy) => {
            invalid.push(`${mm}${div}${yy}`);
          });
        });
      });

      return invalid;
    })();
    it.each([...invalidmmyy.map((invalid) => [`${invalid}`, false]), ...validmmyy.map((valid) => [`${valid}`, true])])(
      '%p should return %p',
      (value, expected) => {
        expect(isDate(mmyyToDate(value.toString()))).toBe(expected);
      }
    );

    it('should throw exception if invalid', () => {
      expect(() => {
        getDateFromNowStrict(undefined);
      }).toThrow(Error);
    });
  });
});
