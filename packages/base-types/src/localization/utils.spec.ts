/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { getLocaleFromUrl, setLocaleToUrl } from './utils';

describe('localization/utils.ts', () => {
  describe('isDataOptional', () => {
    it('should be defined', () => {
      expect(getLocaleFromUrl).toBeDefined();
      expect(setLocaleToUrl).toBeDefined();
    });

    it.each([
      ['http://localhost:3000/product_health_request/1/list?locale=da_DK', 'da_DK'],
      ['http://localhost:3000/product_health_request/1/list?locale=da_DK&login=guest', 'da_DK'],
      ['http://localhost:3000/product_health_request/1/list?login=guest', null]
    ])('when "%p" is given should return "%p"', (value, expected) => {
      expect(getLocaleFromUrl(value)).toStrictEqual(expected);
    });

    it.each([
      [
        'http://localhost:3000/product_health_request/1/list?locale=da_DK',
        'en_GB',
        'http://localhost:3000/product_health_request/1/list?locale=en_GB'
      ],
      [
        'http://localhost:3000/product_health_request/1/list?locale=da_DK&login=guest',
        'en_GB',
        'http://localhost:3000/product_health_request/1/list?locale=en_GB&login=guest'
      ],
      [
        'http://localhost:3000/product_health_request/1/list?login=guest',
        'en_GB',
        'http://localhost:3000/product_health_request/1/list?login=guest&locale=en_GB'
      ],
      [
        'http://localhost:3000/product_health_request/1/list',
        'en_GB',
        'http://localhost:3000/product_health_request/1/list?locale=en_GB'
      ]
    ])('when "%p" and "%p" is given should return "%p"', (url, locale, expected) => {
      expect(setLocaleToUrl(url, locale)).toStrictEqual(expected);
    });
  });
});
