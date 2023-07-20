/* eslint-disable no-sparse-arrays */

import { isString } from '../typeguards';

type ConstructorType<T = any> = new (...args: any[]) => T;
export const is = (type: ConstructorType | string, val: any): boolean =>
  ![, null].includes(val) && (isString(type) ? val.constructor.name === type : val.constructor === type);
