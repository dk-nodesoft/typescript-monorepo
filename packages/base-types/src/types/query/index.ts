import type { ConditionalPick, RequireAtLeastOne, Schema, SetOptional, StringKeyOf } from 'type-fest';
import type { Page, PageSize } from '../number';
import type { Data, SimpleData } from '../object';
import type { QueryString, SortDirection } from '../string';

export type FindOptions<T extends Data> = Schema<ConditionalPick<T, string>, string | RegExp>;

export type Filters<T extends Data | SimpleData> = RequireAtLeastOne<SetOptional<T, StringKeyOf<T>>, StringKeyOf<T>>;
export type Sorters<T extends Data> = RequireAtLeastOne<
  SetOptional<Schema<T, SortDirection>, StringKeyOf<T>>,
  StringKeyOf<T>
>;

export type SorterObject = Record<string, SortDirection>;

export type QueryFields<T extends Data> = StringKeyOf<ConditionalPick<T, string>>[];

export type Select<T extends Data> = Schema<T, 1>;

export type QueryParams<T extends Data> = {
  page?: Page;
  pageSize: PageSize;
  query?: QueryString;
  filters?: Filters<T>;
  sorters?: Sorters<T>;
};
