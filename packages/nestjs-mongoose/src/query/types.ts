import type { Data, Filters, Sorters } from '@dk-nodesoft/base-types';

export type QueryOptions<T extends Data = Data> = {
  meta: {
    page: number;
    pageSize: number;
    sorters?: Sorters<T>;
  };
  filters?: Filters<T>;
  select?: Record<string, number>;
  flatten?: boolean;
};
