import { forEach, isArray, isBoolean, isCuidString, isEmpty, isObject, isString } from '@dk-nodesoft/ts-utils';

import type {
  Data,
  DataOptional,
  DataValue,
  DataValueOptional,
  DataWithCuid,
  IdParams,
  ObjectWithCuid,
  Params,
  Payload,
  PayloadWithCuid,
  Result,
  SorterObject,
  TypeguardFunction
} from '../types';
import { CUID_NAME } from '../types';
import { createArrayTypeguard, isArrayOf } from './is-array-of';
import { isIdString } from './is-id';
import { isSortDirection, isSupportedOptionalPrimitive, isSupportedPrimitive } from './string';

export const isParams = (params: unknown): params is Params => isObject(params);
export const isIdParams = (params: unknown): params is IdParams => isParams(params) && isIdString(params.id);
export const isDataValueArray = (value: unknown): value is Array<DataValue> => isArrayOf<DataValue>(value, isDataValue);
export const isDataValue = (value: unknown): value is DataValue =>
  isSupportedPrimitive(value) || isData(value) || isDataValueArray(value);
export const isData = (data: unknown): data is Data => {
  if (!isObject(data) || isArray(data)) {
    return false;
  }

  let is = true;
  forEach(data, (value) => {
    if (!isDataValue(value)) {
      is = false;
      return false;
    }
  });

  return is;
};

export const isArrayOfData = createArrayTypeguard<Data>(isData);

export const isDataValueOptionalArray = (value: unknown): value is Array<DataValueOptional> =>
  isArrayOf<DataValueOptional>(value, isDataValue);
export const isDataValueOptional = (value: unknown): value is DataValueOptional =>
  isSupportedOptionalPrimitive(value) || isDataOptional(value) || isDataValueOptionalArray(value);
export const isDataOptional = (data: unknown): data is DataOptional => {
  if (!isObject(data) && !isArray(data)) {
    return false;
  }

  let is = true;
  forEach(data, (value) => {
    if (!isDataValueOptional(value)) {
      is = false;
      return false;
    }
  });

  return is;
};
export const isPayload = (payload: unknown): payload is Payload => isObject(payload);

export const isResult = <T extends DataOptional | Data = Data>(
  result: unknown,
  dataValidate?: TypeguardFunction<T>
): result is Result<T> => {
  if (!isObject(result)) {
    return false;
  }
  const test = result as Result<T>;
  return isBoolean(test.success) && dataValidate ? dataValidate(test.data) : isData(test.data);
};

export const isObjectWithCuid = (obj: unknown): obj is ObjectWithCuid => {
  if (!isObject(obj)) {
    return false;
  }

  return isCuidString((obj as ObjectWithCuid).cuid);
};

export const isObjectWithOnlyCuid = (obj: unknown): obj is ObjectWithCuid => {
  if (!isObject(obj)) {
    return false;
  }

  const keys = Object.keys(obj);

  return keys.length === 1 && keys.indexOf(CUID_NAME) !== -1;
};

export const isPayloadWithCuid = (payload: unknown): payload is PayloadWithCuid => isPayload(payload);

export const isDataWithCuid = (data: unknown): data is DataWithCuid =>
  isData(data) && isString(data.cuid) && isCuidString(data.cuid);

export const isArrayOfPayloadWithCuid = (payload: unknown): payload is PayloadWithCuid[] =>
  isArrayOf<PayloadWithCuid>(payload, isPayloadWithCuid);

export const isArrayOfDataWithCuid = (data: unknown): data is DataWithCuid[] =>
  !!isArrayOf<DataWithCuid>(data, isDataWithCuid);

export const isSorterObject = (sorters: unknown): sorters is SorterObject => {
  if (!isObject(sorters) || isEmpty(sorters)) {
    return false;
  }

  let is = true;

  forEach(sorters, (sort) => {
    if (!isSortDirection(sort)) {
      is = false;
      return false;
    }
  });

  return is;
};
