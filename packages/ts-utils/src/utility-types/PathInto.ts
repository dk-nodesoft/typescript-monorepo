/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Primitive } from '../types/Primitive';

export type PathInto<T extends Record<string, any>> = keyof {
  [K in keyof T as T[K] extends Primitive
    ? K
    : T[K] extends Record<string, any>
    ? `${K & string}.${PathInto<T[K]> & string}`
    : never]: any;
};
