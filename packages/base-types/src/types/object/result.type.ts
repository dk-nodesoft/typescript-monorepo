import type { DataOptional } from './object.types';
import type { ResultMeta } from './result-meta.type';
import type { ResultSetMeta } from './result-set-meta.type';

export type EmptyResult = object;

export type Result<T extends DataOptional = DataOptional, U extends ResultMeta = ResultMeta> = {
  success: boolean;
  data: T;
  meta?: U;
};

export type ResultSet<T extends DataOptional = DataOptional, U extends ResultSetMeta = ResultSetMeta> = {
  success: boolean;
  data: T[];
  meta: U;
};
