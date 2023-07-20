import type { Primitive } from '../types';

export const isPrimitive = (v: unknown): v is Primitive => Object(v) !== v;
