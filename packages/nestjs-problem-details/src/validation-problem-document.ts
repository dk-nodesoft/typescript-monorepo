import { castArray, forEach } from '@dk-nodesoft/ts-utils';
import { HttpStatus } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { ProblemDocument } from './problem-document';
import type { ErrorDetail } from './types';

const validationDocumentProperties = {
  type: 'validationerror',
  title: 'One or more validation errors occured.',
  status: HttpStatus.BAD_REQUEST
};

export class ValidationProblemDocument extends ProblemDocument {
  static fromErrorDetail(errorDetail: ErrorDetail | ErrorDetail[]): ValidationProblemDocument {
    const errors: ErrorDetail[] = castArray(errorDetail);
    return new ValidationProblemDocument({
      ...validationDocumentProperties,
      errors
    });
  }

  static fromValidationError(validationError: ValidationError | ValidationError[]): ValidationProblemDocument {
    const errors: ErrorDetail[] = [];

    forEach(castArray(validationError), (err) => {
      forEach(err.constraints, (v: string, k: string) => {
        errors.push({
          code: k,
          message: v,
          property: err.property
        });
      });
    });

    return new ValidationProblemDocument({
      ...validationDocumentProperties,
      errors
    });
  }
}
