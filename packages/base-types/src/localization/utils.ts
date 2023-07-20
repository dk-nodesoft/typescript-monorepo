import { get, toLower } from 'lodash';
import { isLocaleString } from '../typeguards';
import type { KeyString, LanguageString, LocaleString } from '../types';
import { LOCALE_PARAM } from './constants';
import type { TranslationsFlat, TranslationsNested } from './types';

/**
 * get the language string from a valid locale string
 * @param locale - the locale string @example "en_GB" "da_dK"
 * @returns LanguageString
 */
export const languageFromLocale = (locale: LocaleString): LanguageString => locale.split('_')[0];

/**
 * Get translated string
 * @param key - single name string
 * @param translations - the object with the translations
 * @param defaultTranslation - default value if translation can't be found for key [defaults to key value]
 * @returns string
 */
export const getTranslation = (key: string, translations: TranslationsFlat = {}, defaultTranslation = key): string =>
  translations[toLower(key)] || defaultTranslation;

/**
 * Get translated string
 * @param key - dotted key string like: "foo.bar.something"
 * @param translations - the object with the nested translations
 * @param defaultTranslation - default value if translation can't be found for key [defaults to key value]
 * @returns string
 */
export const getTranslationNested = (
  key: KeyString,
  translations: TranslationsNested = {},
  defaultTranslation = key
): string => `${get(translations, key) || defaultTranslation}`;

const localeRegex = new RegExp(`${LOCALE_PARAM}=([a-z]{2,3}_[A-Z]{2,3})`);

export const getLocaleFromUrl = (url: string): LocaleString | null => {
  const candidate = localeRegex.exec(url);
  return candidate && candidate.length > 1 && isLocaleString(candidate[1]) ? candidate[1] : null;
};

export const setLocaleToUrl = (url: string, locale: LocaleString): string => {
  const currentLocale = getLocaleFromUrl(url);

  if (currentLocale) {
    return url.replace(currentLocale, locale);
  }

  return (/\?/.test(url) ? `${url}&` : `${url}?`) + `${LOCALE_PARAM}=${locale}`;
};
