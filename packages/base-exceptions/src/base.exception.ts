import type { Message, MessageParameters, MessagePrimitive } from '@dk-nodesoft/base-types';
import type { OptionalExceptFor } from '@dk-nodesoft/ts-utils';
import { isPlainObject, isPresent, isString } from '@dk-nodesoft/ts-utils';
import httpStatus from 'http-status/dist';
import template from 'lodash.template';

export type BaseExceptionDetails = MessagePrimitive | object | undefined;

export type BaseExceptionOptions = Partial<Message> & {
  /**
   * A title for the exception.
   * Default will be a representation of the class name extending
   *
   * @example
   * Name of OopsError will result in a title of Oops Error
   */
  title?: string;
  /**
   * The causing error
   */
  cause?: Error;
  /**
   * The HTTP Status code to be associated with this exception if a response is created.
   * Will default to 500 - Internal server error
   */
  statusCode?: number;
  /**
   * An optional details information represented by a string or a simple object - use only for internal information
   */
  details?: BaseExceptionDetails;
};

export type BaseExceptionError = Message & OptionalExceptFor<BaseExceptionOptions, 'title' | 'statusCode'>;

export type ExceptionResponse = Message & {
  title: string;
  status: number;
  details?: BaseExceptionDetails;
};

/**
 * Defines the base exception, which is handled by the Problem Document filter
 */
export class BaseException extends Error {
  /**
   * Instantiate a plain exception. Only used for extending specific exceptions for an example checkout the OopsError under exceptions
   *
   * @remarks
   * The constructor argument defines the options
   *
   * @param options - An object for all options.
   */
  constructor(private readonly options?: BaseExceptionOptions) {
    super();
    this.initName();
    this.initMessage();
    this.initCause();

    this.code = this.resolveCode();
    this.status = this.resolveStatus();
    this.title = this.resolveTitle();
    this.details = this.resolveDetails();
  }

  public cause: Error | undefined;
  private code: string;
  private title: string;
  private status: number;
  private details: BaseExceptionDetails;

  private interpolateMessage(message: string, props?: MessageParameters): string {
    const compiled = template(message);
    return compiled(props || {});
  }

  /**
   * Configures error chaining support
   *
   * See:
   * - https://nodejs.org/en/blog/release/v16.9.0/#error-cause
   * - https://github.com/microsoft/TypeScript/issues/45167
   */
  public initCause(): void {
    if (this.options?.cause) {
      this.cause = this.options.cause;
    }
  }

  public initName(): void {
    this.name = this.constructor.name;
  }

  public initMessage(): void {
    if (isPlainObject(this.options) && isPresent(this.options.message)) {
      this.message = this.interpolateMessage(this.options.message, this.options.parameters);
      return;
    }

    const exceptionName = this.getNameJoined(' ');

    if (exceptionName) {
      this.message = exceptionName;
    } else {
      this.message = 'An exception occurred - no message provided';
    }
  }

  private getNameJoined(joinBy: string): string | null {
    const match = this.name.match(/[A-Z][a-z]+|\d+/g);
    return match ? match!.join(joinBy) : null;
  }

  private resolveCode(): string {
    if (isPlainObject(this.options) && isPresent(this.options.code)) {
      this.code = this.options.code;
      return this.code.toLowerCase();
    }

    const exceptionName = this.getNameJoined('_');

    if (exceptionName) {
      this.code = exceptionName;
    } else {
      this.code = 'unknown_exception_occurred';
    }

    return this.code.toLowerCase();
  }

  private resolveDetails(): BaseExceptionDetails {
    return this.options?.details;
  }

  private resolveStatus(): number {
    return this.options?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveTitle(): string {
    if (isPlainObject(this.options) && isPresent(this.options.title)) {
      return this.options?.title;
    }

    const exceptionName = this.getNameJoined(' ');
    if (exceptionName) {
      return exceptionName;
    }

    return (httpStatus as any)[this.status] as string;
  }

  /**
   * getError returns an object representing all information about the error (detailed information)
   * @returns
   */
  public getError(): BaseExceptionError {
    return {
      code: this.code,
      message: this.message,
      title: this.title,
      statusCode: this.status,
      parameters: this.getMessageParameters(),
      cause: this.cause,
      details: this.details
    };
  }

  /**
   * getResponse returns an object that can be used to return directly to the user (response)
   * @returns
   */
  public getResponse(): ExceptionResponse {
    return {
      code: this.code,
      message: this.message,
      title: this.title,
      status: this.status,
      parameters: this.getMessageParameters(),
      details: this.details
    };
  }

  public getMessageParameters(): MessageParameters | undefined {
    if (isPlainObject(this.options) && isPresent(this.options.parameters)) {
      return this.options.parameters;
    }
  }

  public getStatus(): number {
    return this.status;
  }

  public getTitle(): string {
    return this.title;
  }

  public getCode(): string {
    return this.code;
  }

  public getDetails(): object | undefined {
    const details = this.details;
    if (isString(details)) {
      return { details };
    }

    return details;
  }

  /**
   * A static helper method for creating a valid options object for extending BaseExceptions
   *
   * @example
   * ```ts
   * export class OopsError extends BaseException {
   *  constructor(messageOrOptions: MessagePrimitive | OopsErrorOptions) {
   *    super(BaseException.createOptions(messageOrOptions));
   *  }
   * }
   * ```
   *
   * @param messageOrOptions - Either a string with the message for an options object
   * @param defaultOptions - An options object to be used to override default options
   */
  public static createOptions(
    messageOrOptions: MessagePrimitive | BaseExceptionOptions,
    defaultOptions?: BaseExceptionOptions
  ): BaseExceptionOptions {
    if (isString(messageOrOptions)) {
      return { message: messageOrOptions, ...defaultOptions };
    }

    return { ...messageOrOptions, ...defaultOptions };
  }
}
