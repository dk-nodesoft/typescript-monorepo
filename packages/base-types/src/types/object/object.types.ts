import type { CuidString } from '@dk-nodesoft/ts-utils';
import type { Dictionary } from 'lodash';
import type { Except, PartialDeep, SetOptional } from 'type-fest';
import type { IdString, LanguageString, LocaleString } from '../string';

export type CuidName = 'cuid';
export type IdName = 'id';
export const CUID_NAME: CuidName = 'cuid';
export const ID_NAME: IdName = 'id';

/** extendable object type with cuid */
export type ObjectWithCuid = {
  [CUID_NAME]: CuidString;
};

/** extendable object type with id */
export type ObjectWithId = {
  [ID_NAME]: IdString;
};

/** extendable object type with optional id */
export type ObjectWithIdOptional = PartialDeep<ObjectWithId>;

/** extendable object type with optional cuid */
export type ObjectWithCuidOptional = PartialDeep<ObjectWithCuid>;

export type SetCuidOptional<T extends ObjectWithCuid> = SetOptional<T, CuidName>;

export type SupportedPrimitives = string | number | boolean | null;
export type SupportedOptionalPrimitives = SupportedPrimitives | undefined;
export type DataValue<T extends Data = Data> = T | Array<T> | SupportedPrimitives | Array<SupportedPrimitives>;
export type DataValueOptional<T extends DataOptional = DataOptional> =
  | T
  | Array<T>
  | SupportedOptionalPrimitives
  | SupportedOptionalPrimitives[];

export type SimpleData = {
  [x: string]: SupportedPrimitives;
};

export type Data = {
  [x: string]: DataValue;
};
export type DataOptional = {
  [x: string]: DataValueOptional;
};

export type Payload = Data;

export type DataArray = Array<DataValue>;
export type DataOptionalArray = Array<DataOptional>;

export type DataWithCuid = ObjectWithCuid & {
  [x: string]: DataValue<DataWithCuid>;
};
export type DataOptionalWithCuid = ObjectWithCuid & {
  [x: string]: DataValueOptional<DataOptionalWithCuid>;
};

export type ObjectWithOptionalId = PartialDeep<ObjectWithId>;

// type util
export type StripId<T extends ObjectWithId> = Except<T, IdName>;

export type PayloadWithCuid = Payload & SetOptional<ObjectWithCuid, CuidName>;
export type Params = Record<string, any>;
export type ParamsUnprocessed = Dictionary<string | string[]>;

export type LocaleParams = {
  locale: LocaleString;
};

export type LanguageParams = {
  language: LanguageString;
};
