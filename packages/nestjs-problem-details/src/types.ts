import type { JsonObject, PartialDeep, SetOptional, StringKeyOf } from 'type-fest';

export type ProblemDetailInternal = SetOptional<JsonObject, StringKeyOf<JsonObject>>;
export type ProblemDetailExtras = PartialDeep<JsonObject>;

export type ErrorDetail = {
  code: string;
  message: string;
  property?: string;
  extras?: ProblemDetailExtras;
};

export type ProblemDetail = {
  status: number;
  type: string;
  title: string;
  detail?: string;
  instance?: string;
  errors?: ErrorDetail[];
  internal?: ProblemDetailInternal;
  extras?: ProblemDetailExtras;
};
