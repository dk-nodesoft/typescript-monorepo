/* eslint-disable regexp/no-dupe-disjunctions */
/* eslint-disable regexp/prefer-w */
/* eslint-disable regexp/prefer-d */
import { isBoolean, isNull, isNumber, isString, isUndefined } from '@dk-nodesoft/ts-utils';
import validator from 'validator';
import type {
  EmailString,
  LanguageString,
  LocaleString,
  PasswordString,
  SortDirection,
  SupportedOptionalPrimitives,
  SupportedPrimitives,
  TenantString
} from '../types';

export const isLocaleString = (locale: unknown): locale is LocaleString =>
  isString(locale) && /^[a-z]{2,3}_[A-Z]{2,3}$/.test(locale);

export const isLanguageString = (language: unknown): language is LanguageString =>
  isString(language) && /^[a-z]{2,3}$/.test(language);

export const isSortDirection = (sort: unknown): sort is SortDirection =>
  isString(sort) && /asc|ascending|desc|descending/.test(sort);

export const isEmailString = (email: unknown): email is EmailString => isString(email) && validator.isEmail(email);

export const isPasswordString = (password: unknown): password is PasswordString => isString(password) && !!password;

export const isTenantString = (tenant: unknown): tenant is TenantString =>
  isString(tenant) && /[0-9a-z_]+/i.test(tenant);

export const isSupportedPrimitive = (value: unknown): value is SupportedPrimitives =>
  isString(value) || isNumber(value) || isBoolean(value) || isNull(value);

export const isSupportedOptionalPrimitive = (value: unknown): value is SupportedOptionalPrimitives =>
  isSupportedPrimitive(value) || isUndefined(value);
