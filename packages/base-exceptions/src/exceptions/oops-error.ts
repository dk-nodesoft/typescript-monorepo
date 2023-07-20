import type { MessageParameters, MessagePrimitive } from '@dk-nodesoft/base-types';
import type { BaseExceptionDetails } from '../base.exception';
import { BaseException } from '../base.exception';

export type OopsErrorOptions = {
  /**
   * The error message describing the error
   */
  message: MessagePrimitive;

  /**
   * Parameters used for interpolation values in the message
   */
  parameters?: MessageParameters;

  /**
   * Either a string detailing the error (could be a resolution for the problem) or an object holding additional information
   * for the developer / operator. In case of endpoints returning information this is to be handled as internal information
   */
  details?: BaseExceptionDetails;

  /**
   * An optional reference to a causing error
   */
  cause?: Error;
};

/**
 * The OopsError is to be considered an option for
 * - Providing an exception for configuration error
 * - Providing an exception for developers
 * - Internal assertion
 */
export class OopsError extends BaseException {
  constructor(messageOrOptions: MessagePrimitive | OopsErrorOptions) {
    super(BaseException.createOptions(messageOrOptions));
  }
}
