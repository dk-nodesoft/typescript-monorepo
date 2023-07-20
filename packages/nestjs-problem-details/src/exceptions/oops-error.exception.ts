import { HttpStatus } from '@nestjs/common';
import { ProblemDetailException } from 'src/problem-detail.exception';
import { ProblemDocument } from 'src/problem-document';
import { ProblemDetailExtras } from 'src/types';

export class OopsErrorException extends ProblemDetailException {
  constructor(message: string, extras?: ProblemDetailExtras) {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const problemDocument = ProblemDocument.create({
      status,
      detail: message,
      title: 'Oops Error',
      type: 'oops_error',
      extras
    });
    super(problemDocument, status);
  }
}
