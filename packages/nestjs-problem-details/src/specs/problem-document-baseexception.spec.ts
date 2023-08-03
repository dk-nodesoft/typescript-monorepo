import type { BaseExceptionOptions } from '@dk-nodesoft/base-exceptions';
import { BaseException } from '@dk-nodesoft/base-exceptions';
import httpStatus from 'http-status';
import { ProblemDocument } from '../problem-document';
import type { ProblemDetail } from '../types';

class SimpleOopsError extends BaseException {
  constructor(message: string) {
    super(BaseException.createOptions(message));
  }
}

class AdvancedOopsError extends BaseException {
  constructor(options: BaseExceptionOptions) {
    super(options);
  }
}

class Unauthorized extends BaseException {
  constructor() {
    super({ statusCode: httpStatus.UNAUTHORIZED });
  }
}

type SpecInstance = {
  name: string;
  input: BaseException;
  expected: ProblemDetail;
};

const specs: SpecInstance[] = [
  {
    name: 'SimpleOopsError - Basic instance providing only message',
    input: new SimpleOopsError('Basic error'),
    expected: {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      type: 'simple_oops_error',
      title: 'Simple Oops Error',
      detail: 'Basic error',
      internal: {
        stack: {}
      },
      extras: {}
    }
  },
  {
    name: 'AdvancedOopsError - Message with details ',
    input: new AdvancedOopsError({ message: 'Message with details', details: { foo: 'bar' } }),
    expected: {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      type: 'advanced_oops_error',
      title: 'Advanced Oops Error',
      detail: 'Message with details',
      internal: {
        stack: {},
        foo: 'bar'
      },
      extras: {}
    }
  },
  {
    name: 'AdvancedOopsError - Message with parameters ',
    input: new AdvancedOopsError({ message: 'Message with details - ${foo}', parameters: { foo: 'bar' } }),
    expected: {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      type: 'advanced_oops_error',
      title: 'Advanced Oops Error',
      detail: 'Message with details - bar',
      internal: {
        stack: {}
      },
      extras: {
        foo: 'bar'
      }
    }
  },
  {
    name: 'AdvancedOopsError - Message with all options',
    input: new AdvancedOopsError({
      code: 'oops_forbidden',
      message: 'Message with details - ${foo}',
      title: 'Forbidden',
      parameters: { foo: 'bar' },
      details: 'Fix the problem by ...',
      statusCode: httpStatus.FORBIDDEN
    }),
    expected: {
      status: httpStatus.FORBIDDEN,
      type: 'oops_forbidden',
      title: 'Forbidden',
      detail: 'Message with details - bar',
      internal: {
        stack: {},
        details: 'Fix the problem by ...'
      },
      extras: {
        foo: 'bar'
      }
    }
  },

  {
    name: 'Unauthorized - Replacing http status',
    input: new Unauthorized(),
    expected: {
      status: httpStatus.UNAUTHORIZED,
      type: 'unauthorized',
      title: 'Unauthorized',
      detail: 'Unauthorized',
      internal: {
        stack: {}
      }
    }
  }
];

describe('ProblemDocument - BaseException', () => {
  it.each(specs)('$name', ({ input, expected }) => {
    const problemDocument = ProblemDocument.from(input);

    expect(problemDocument).toBeDefined();

    const response = problemDocument.createResponse();
    expect(response).toBeDefined();

    expect(response).toMatchObject(expected);
  });
});
