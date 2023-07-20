/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable jest/no-conditional-expect */
import { isProduction } from '@dk-nodesoft/ts-utils';
import { HttpStatus } from '@nestjs/common';
import { defaultHttpErrors } from '../constants';
import { ProblemDocument } from '../problem-document';
import type { ProblemDetail } from '../types';

type ProblemDetails = {
  [key: string]: ProblemDetail;
};

const INTERNAL_SERVER_ERROR = 'Internal Server Error';

const problemDocuments: ProblemDetails = {
  requiredOnly: {
    type: defaultHttpErrors[HttpStatus.INTERNAL_SERVER_ERROR],
    title: INTERNAL_SERVER_ERROR,
    status: HttpStatus.INTERNAL_SERVER_ERROR
  },
  requiredAndOptional: {
    type: defaultHttpErrors[HttpStatus.INTERNAL_SERVER_ERROR],
    title: INTERNAL_SERVER_ERROR,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    detail: 'Failed to communicate with service back-end',
    instance: '/registration/123456'
  },
  minimum: {
    type: defaultHttpErrors[HttpStatus.INTERNAL_SERVER_ERROR],
    title: INTERNAL_SERVER_ERROR,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    detail: 'Error communicating with Synchronicer back-end'
  }
};

describe('ProblemDocument', () => {
  it('should be defined', () => {
    expect(ProblemDocument).toBeDefined();
  });

  describe('Using static create method', () => {
    it('should create a basic problem document - required properties only', () => {
      const problemDocument = ProblemDocument.create(problemDocuments.requiredOnly);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.type).toBe('internal_server_error');
      expect(response.title).toBe(INTERNAL_SERVER_ERROR);
    });

    it('should create a basic problem document - to create a valid message', () => {
      const problemDocument = ProblemDocument.create(problemDocuments.minimum);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.type).toBe('internal_server_error');
      expect(response.title).toBe(INTERNAL_SERVER_ERROR);
      expect(response.detail).toBe(problemDocuments.minimum.detail);
    });

    it('should create a basic problem document - with optional properties', () => {
      const problemDocument = ProblemDocument.create(problemDocuments.requiredAndOptional);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.status).toBe(problemDocuments.requiredAndOptional.status);
      expect(response.type).toBe(problemDocuments.requiredAndOptional.type);
      expect(response.title).toBe(problemDocuments.requiredAndOptional.title);
      expect(response.detail).toBe(problemDocuments.requiredAndOptional.detail);
      expect(response.instance).toBe(problemDocuments.requiredAndOptional.instance);
    });

    it('should create a basic problem document - with optional properties and extensions', () => {
      const problemDocument = ProblemDocument.create({
        ...problemDocuments.requiredAndOptional,
        internal: { stack: 'here goes the stack' },
        extras: { registration: 123456 }
      });

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.status).toBe(problemDocuments.requiredAndOptional.status);
      expect(response.type).toBe(problemDocuments.requiredAndOptional.type);
      expect(response.title).toBe(problemDocuments.requiredAndOptional.title);
      expect(response.detail).toBe(problemDocuments.requiredAndOptional.detail);
      expect(response.instance).toBe(problemDocuments.requiredAndOptional.instance);
      expect(response.extras?.registration).toBe(123456);

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
        expect(response.internal).toStrictEqual({ stack: 'here goes the stack' });
      } else {
        expect(response.internal).toBeUndefined();
      }
    });
  });
});
