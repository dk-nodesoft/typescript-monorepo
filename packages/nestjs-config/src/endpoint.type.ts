import type { HTTPMethod } from '@dk-nodesoft/ts-utils';

export type ConfigEndpoint = {
  url: string;
  path: string;
  method?: HTTPMethod;
  params?: { [x: string]: string | number };
  timeout?: number;
  headers?: { [x: string]: string };
  finalUrl?: string;
};
