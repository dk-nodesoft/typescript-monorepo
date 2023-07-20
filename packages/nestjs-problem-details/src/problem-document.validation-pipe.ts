import type { Message } from '@dk-nodesoft/base-types';
import { forEach } from '@dk-nodesoft/ts-utils';
import type { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ValidationErrorException } from './exceptions';

export type ProblemDocumentValidationPipeOptions = ValidationPipeOptions;

export const ProblemDocumentValidationPipe = (options?: ProblemDocumentValidationPipeOptions): ValidationPipe => {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    dismissDefaultMessages: false,
    validationError: {
      target: false
    },
    ...options,
    exceptionFactory: (errors: ValidationError[]): ValidationErrorException => {
      const response: Message[] = [];

      forEach(errors, (err: ValidationError) => {
        forEach(err.constraints, (v: string, k: string) => {
          response.push({
            code: k,
            message: v,
            parameters: { field: err.property }
          });
        });
      });

      return new ValidationErrorException(response);
    }
  });
};
