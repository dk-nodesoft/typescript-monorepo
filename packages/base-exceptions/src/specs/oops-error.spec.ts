/* eslint-disable jest/no-conditional-expect */
/* eslint-disable sonarjs/no-duplicate-string */
import type { MessagePrimitive } from '@dk-nodesoft/base-types';
import { isError, isString } from '@dk-nodesoft/ts-utils';
import httpStatus from 'http-status';
import type { BaseExceptionError } from '../base.exception';
import type { OopsErrorOptions } from '../exceptions/oops-error';
import { OopsError } from '../exceptions/oops-error';
import { isBaseException } from '../is-base-exception.typeguard';

type SpecInstance = {
  name: string;
  input: OopsErrorOptions | MessagePrimitive;
  expected: BaseExceptionError;
};

const causingError = new Error('Caused by me');

const specs: SpecInstance[] = [
  {
    name: 'Basic instance providing only message',
    input: 'Ooh no an error occurred',
    expected: {
      code: 'oops_error',
      message: 'Ooh no an error occurred',
      title: 'Oops Error',
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      parameters: undefined,
      cause: undefined,
      details: undefined
    }
  },
  {
    name: 'Instance with message and parameters for interpolation',
    input: { message: 'You missed the answer of ${answer}', parameters: { answer: 42 } },
    expected: {
      code: 'oops_error',
      message: 'You missed the answer of 42',
      title: 'Oops Error',
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      parameters: { answer: 42 },
      cause: undefined,
      details: undefined
    }
  },
  {
    name: 'Instance with message and details string',
    input: { message: 'Another message with details', details: 'Kilroy was here' },
    expected: {
      code: 'oops_error',
      message: 'Another message with details',
      title: 'Oops Error',
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      parameters: undefined,
      cause: undefined,
      details: 'Kilroy was here'
    }
  },
  {
    name: 'Instance with message and details object',
    input: { message: 'Another message with details', details: { foo: 'bar' } },
    expected: {
      code: 'oops_error',
      message: 'Another message with details',
      title: 'Oops Error',
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      parameters: undefined,
      cause: undefined,
      details: { foo: 'bar' }
    }
  },
  {
    name: 'Instance with message and cause',
    input: { message: 'An error occured - check cause', cause: causingError },
    expected: {
      code: 'oops_error',
      message: 'An error occured - check cause',
      title: 'Oops Error',
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      parameters: undefined,
      cause: causingError,
      details: undefined
    }
  },
  {
    name: 'Instance with all options',
    input: {
      message: 'An error occured - check cause and answer of ${answer}',
      parameters: { answer: 42 },
      cause: causingError,
      details: { foo: 'bar' }
    },
    expected: {
      code: 'oops_error',
      message: 'An error occured - check cause and answer of 42',
      title: 'Oops Error',
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      parameters: { answer: 42 },
      cause: causingError,
      details: {
        foo: 'bar'
      }
    }
  }
];

describe('OopsError', () => {
  it.each(specs)('$name', ({ input, expected }) => {
    const oopsError = new OopsError(input);

    expect(isError(oopsError)).toBeTruthy();
    expect(isBaseException(oopsError)).toBeTruthy();

    const error = oopsError.getError();
    expect(error).toMatchObject(expected);

    expect(oopsError.name).toStrictEqual('OopsError');

    expect(oopsError.getTitle()).toStrictEqual(expected.title);
    expect(oopsError.getCode()).toStrictEqual(expected.code);
    expect(oopsError.getStatus()).toStrictEqual(expected.statusCode);
    if (expected.parameters) {
      expect(oopsError.getMessageParameters()).toMatchObject(expected.parameters);
    } else {
      expect(oopsError.getMessageParameters()).toBeUndefined();
    }
    if (expected.details) {
      if (isString(expected.details)) {
        expect(oopsError.getDetails()).toMatchObject({ details: expected.details });
      } else {
        expect(oopsError.getDetails()).toMatchObject(expected.details);
      }
    } else {
      expect(oopsError.getDetails()).toBeUndefined();
    }

    const response = oopsError.getResponse();
    expect(response.status).toStrictEqual(expected.statusCode);
    expect(response.title).toStrictEqual(expected.title);
    expect(response.code).toStrictEqual(expected.code);
    expect(response.message).toStrictEqual(expected.message);
    if (expected.parameters) {
      expect(response.parameters).toMatchObject(expected.parameters);
    } else {
      expect(response.parameters).toBeUndefined();
    }
    if (expected.details) {
      if (isString(expected.details)) {
        expect(response.details).toStrictEqual(expected.details);
      } else {
        expect(response.details).toMatchObject(expected.details);
      }
    } else {
      expect(response.details).toBeUndefined();
    }
  });
});
