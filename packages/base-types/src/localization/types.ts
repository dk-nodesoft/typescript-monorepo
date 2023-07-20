import type { DataOptional, LanguageString, LocaleString, TenantString } from '@dk-nodesoft/base-types';

export type TranslationsFlat = Record<string, string>;
export type TranslationsNested = DataOptional;
export type Translations = TranslationsFlat | TranslationsNested;

export type TranslationInfo = {
  tenant: TenantString;
  language: LanguageString;
  locale: LocaleString[];
  namespaces?: string[];
  flat: boolean;
  translations: Translations;
};
