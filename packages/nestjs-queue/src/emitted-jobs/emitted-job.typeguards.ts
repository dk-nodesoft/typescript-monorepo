import { isCuidString, isObject, isString, isUndefined } from '@dk-nodesoft/ts-utils';
import type { EmittedJobContext } from './emitted-job.types';

export const isEmittedJobContext = (context: unknown): context is EmittedJobContext => {
  if (!isObject(context)) {
    return false;
  }

  const t = context as EmittedJobContext;

  return (
    ((isCuidString(t.requestId) || isUndefined(t.requestId)) && isString(t.userId) && !!t.userId) ||
    isUndefined(t.userId)
  );
};
