import type { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ProblemDocument } from './problem-document';
import type { ErrorDetail } from './types';

export class ProblemDetailException extends HttpException {
  constructor(response: string | ProblemDocument, status: HttpStatus) {
    super(response, status);
  }

  getError(): ErrorDetail[] | undefined {
    const response = this.getResponse();

    if (response instanceof ProblemDocument) {
      return response.getError();
    }
  }
}
