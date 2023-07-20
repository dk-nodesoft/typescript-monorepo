import type { CuidString } from '@dk-nodesoft/ts-utils';

/**
 * a mongo-id string
 * typeguard: isIdString
 */
export type IdString = string;

/**
 * a email address string
 * typeguard: isEmailString
 */
export type EmailString = string;
/**
 * a password string (not empty)
 * typeguard: isPasswordString
 */
export type PasswordString = string;
/**
 * A Tenant short name.
 * Examples: "SD" "SD2" "SD_3"
 * typeguard: isTenantString
 */
export type TenantString = string;
/** the code for login by email or sms */
export type VerificationCode = string;
/** string for longer descriptions */
export type DescriptionString = string;
/** string for names, typical short strings */
export type NameString = string;
/** string for querying */
export type QueryString = string;
/**
 * valid sorting direction
 * typeguard: isSortDirection
 */
export type SortDirection = 'asc' | 'ascending' | 'desc' | 'descending';
export type JsonString = string;
export type KeyString = string;
/**
 * locale code representation. examples: "en_GB" or "da_DK"
 * typeguard: isLocaleString
 */
export type LocaleString = string;
/**
 * language code representation. examples: "en" or "da"
 * typeguard: isLanguageString
 */
export type LanguageString = string;
export type LocalizationId = string;
export type Translation = string;

/**
 * id for indetifying request's
 */
export type RequestId = CuidString;
/** string for QR url */
export type Url = string;
