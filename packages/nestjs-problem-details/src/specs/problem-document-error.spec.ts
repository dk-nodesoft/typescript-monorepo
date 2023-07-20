/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable jest/no-conditional-expect */
import { isProduction } from '@dk-nodesoft/ts-utils';
import { HttpStatus } from '@nestjs/common';
import { ProblemDocument } from '../problem-document';

const INTERNAL_SERVER_ERROR = 'Internal Server Error';

class CustomError extends Error {
  constructor(message?: string) {
    super();
    this.name = this.constructor.name;
    if (message) {
      this.message = message;
    }
  }
}

describe('ProblemDocument', () => {
  it('should be defined', () => {
    expect(ProblemDocument).toBeDefined();
  });

  describe('Using static from method passing Error', () => {
    it('should create a problem document - from an error with no message', () => {
      const error = new Error();
      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.detail).toBe('');
      expect(response.type).toBe('internal_server_error');
      expect(response.title).toBe(INTERNAL_SERVER_ERROR);
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
      } else {
        expect(response.internal).toBeUndefined();
      }
    });

    it('should create a problem document - from an error with a message', () => {
      const message = 'A communication error occurred';
      const error = new Error(message);
      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.detail).toBe(message);
      expect(response.type).toBe('internal_server_error');
      expect(response.title).toBe(INTERNAL_SERVER_ERROR);
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
      } else {
        expect(response.internal).toBeUndefined();
      }
    });

    it('should create a problem document - from a extended error with no message', () => {
      const error = new CustomError();
      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.detail).toBe('');
      expect(response.type).toBe('internal_server_error');
      expect(response.title).toBe(INTERNAL_SERVER_ERROR);
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
      } else {
        expect(response.internal).toBeUndefined();
      }
    });

    it('should create a problem document - from a extended error with a message', () => {
      const message = 'A communication error occurred';
      const error = new CustomError(message);
      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.detail).toBe(message);
      expect(response.type).toBe('internal_server_error');
      expect(response.title).toBe(INTERNAL_SERVER_ERROR);
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
      } else {
        expect(response.internal).toBeUndefined();
      }
    });
  });
});
