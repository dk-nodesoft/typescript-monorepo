import type { Data, DataValue, SupportedPrimitives } from '@dk-nodesoft/base-types';
import { isData } from '@dk-nodesoft/base-types';
import { forEach, isBoolean, isDate, isNil, isNumber, isString } from '@dk-nodesoft/ts-utils';
import { isUndefined } from 'lodash';
import { isMongoId, toIdStringStrict } from '../utils';

export const flattenDocument = (
  doc: Data,
  newDoc: { [key: string]: string | number | boolean } = {},
  nested = false
): Record<string, SupportedPrimitives> => {
  forEach(doc, (value: DataValue, key: string) => {
    if (nested && !isUndefined(newDoc[`${key}`])) {
      return;
    }

    if (nested && (key === 'id' || key === '_id')) {
      return;
    }

    if (isMongoId(value)) {
      newDoc[`${key}`] = toIdStringStrict(value);
      return;
    }

    if (isNil(value)) {
      newDoc[`${key}`] = '';
      return;
    }

    if (isDate(value)) {
      newDoc[`${key}`] = value.toISOString();
      return;
    }

    if (isString(value) || isNumber(value) || isBoolean(value)) {
      newDoc[`${key}`] = value;
      return;
    }

    if (isData(value)) {
      flattenDocument(value, newDoc, true);
    }
  });

  return newDoc;
};
