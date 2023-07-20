/* eslint-disable jest/no-conditional-expect */
import { isProduction } from '@dk-nodesoft/ts-utils';
import { BadRequestException, ForbiddenException, HttpStatus } from '@nestjs/common';
import { OopsErrorException as AdvancedOopsError } from '../exceptions/oops-error.exception';
import { ProblemDetailException } from '../problem-detail.exception';
import { ProblemDocument } from '../problem-document';

const INTERNAL_SERVER_ERROR = 'Internal Server Error';

class SimpleOopsError extends ProblemDetailException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const noFundsProblem = ProblemDocument.create({
  type: 'out-of-credit',
  title: 'Out of credit',
  detail: 'Your current balance is 30, but the cost is 50.',
  instance: '/account/12345/msgs/abc',
  status: HttpStatus.FORBIDDEN,
  extras: { balance: 30 }
});

describe('ProblemDocument', () => {
  it('should be defined', () => {
    expect(ProblemDocument).toBeDefined();
  });

  describe('Using static from method passing HttpException', () => {
    it('should create a problem document - from an error with no message', () => {
      const error = new BadRequestException();
      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();

      expect(response.type).toBe('bad_request');
      expect(response.title).toBe('Bad Request');
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.detail).toBe('An error occurred');

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
      } else {
        expect(response.internal).toBeUndefined();
      }
    });

    it('should create a problem document - from an error with a message', () => {
      const message = 'The requested registration does not exist';
      const error = new BadRequestException(message);
      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.detail).toBe(message);
      expect(response.type).toBe('bad_request');
      expect(response.title).toBe('Bad Request');
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
      } else {
        expect(response.internal).toBeUndefined();
      }
    });

    it('should create a problem document - from an error with a message and description', () => {
      const message = 'The requested registration does not exist';
      const description = 'Try again with another registration';
      const error = new BadRequestException(message, description);

      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.detail).toBe(message);
      expect(response.type).toBe('bad_request');
      expect(response.title).toBe(description);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
      } else {
        expect(response.internal).toBeUndefined();
      }
    });

    it('should create a problem document - from a extended error with only message', () => {
      const message = 'You are a fool';
      const error = new SimpleOopsError(message);
      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.detail).toBe(message);
      expect(response.type).toBe('internal_server_error');
      expect(response.title).toBe(INTERNAL_SERVER_ERROR);
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(response.internal).toBeUndefined();
    });

    it('should create a problem document - from a extended error with a message', () => {
      const message = 'You are a fool';
      const extras = { foo: 'bar', answer: 42 };
      const error = new AdvancedOopsError(message, extras);
      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.detail).toBe(message);
      expect(response.type).toBe('oops_error');
      expect(response.title).toBe('Oops Error');
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(response.extras?.foo).toBe('bar');
      expect(response.extras?.answer).toBe(42);

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
      } else {
        expect(response.internal).toBeUndefined();
      }

      problemDocument.logError();
    });
  });

  describe('Handle exception with problem', () => {
    it('should correctly handle an exception with a problem document', () => {
      const error = new ForbiddenException(noFundsProblem);
      const problemDocument = ProblemDocument.from(error);

      expect(problemDocument).toBeDefined();

      const response = problemDocument.createResponse();
      expect(response).toBeDefined();
      expect(response.detail).toBe('Your current balance is 30, but the cost is 50.');
      expect(response.type).toBe('out-of-credit');
      expect(response.title).toBe('Out of credit');
      expect(response.status).toBe(HttpStatus.FORBIDDEN);

      if (!isProduction()) {
        expect(response.internal).toBeDefined();
      } else {
        expect(response.internal).toBeUndefined();
      }
    });
  });
});
