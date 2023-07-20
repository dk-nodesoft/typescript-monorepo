import { castArray } from '@dk-nodesoft/ts-utils';
import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ProblemDetailException } from '../problem-detail.exception';
import type { ErrorDetail } from '../types';
import { ValidationProblemDocument } from '../validation-problem-document';

export class ValidationErrorException extends ProblemDetailException {
  constructor(errors: ValidationError | ValidationError[] | ErrorDetail | ErrorDetail[]) {
    const status = HttpStatus.BAD_REQUEST;
    let problemDocument: ValidationProblemDocument;

    const errorArr = castArray(errors);

    if (errorArr[0] instanceof ValidationError) {
      problemDocument = ValidationProblemDocument.fromValidationError(errorArr as ValidationError[]);
    } else {
      problemDocument = ValidationProblemDocument.fromErrorDetail(errorArr as ErrorDetail[]);
    }

    super(problemDocument, status);
  }
}
