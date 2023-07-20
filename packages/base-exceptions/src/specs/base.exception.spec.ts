/* eslint-disable sonarjs/no-duplicate-string */
import httpStatus from 'http-status';
import { BaseException } from '../base.exception';

describe('BaseException', () => {
  it('should create an instance of a base exception - no parameters passed', () => {
    const baseException = new BaseException();

    expect(baseException).toBeDefined();

    const response = baseException.getResponse();
    expect(response.code).toStrictEqual('base_exception');
    expect(response.message).toStrictEqual('Base Exception');
    expect(response.title).toStrictEqual('Base Exception');

    const status = baseException.getStatus();
    expect(status).toStrictEqual(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should create an instance of a base exception - message parameter passed', () => {
    const baseException = new BaseException({ message: 'Optional Base Exception' });

    expect(baseException).toBeDefined();

    const response = baseException.getResponse();
    expect(response.code).toStrictEqual('base_exception');
    expect(response.message).toStrictEqual('Optional Base Exception');
    expect(response.title).toStrictEqual('Base Exception');

    const status = baseException.getStatus();
    expect(status).toStrictEqual(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should create an instance of a base exception - code parameter passed', () => {
    const baseException = new BaseException({ code: 'optional_base_exception' });

    expect(baseException).toBeDefined();

    const response = baseException.getResponse();
    expect(response.code).toStrictEqual('optional_base_exception');
    expect(response.message).toStrictEqual('Base Exception');
    expect(response.title).toStrictEqual('Base Exception');

    const status = baseException.getStatus();
    expect(status).toStrictEqual(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should create an instance of a base exception - message passed as paramter', () => {
    const baseException = new BaseException({ message: 'Message Base Exception' });

    expect(baseException).toBeDefined();

    const response = baseException.getResponse();
    expect(response.code).toStrictEqual('base_exception');
    expect(response.message).toStrictEqual('Message Base Exception');
    expect(response.title).toStrictEqual('Base Exception');

    const status = baseException.getStatus();
    expect(status).toStrictEqual(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should create an instance of a base exception - all options provided', () => {
    const baseException = new BaseException({
      code: 'all_base_exception',
      message: 'All base exception paramters',
      title: 'All base title',
      statusCode: httpStatus.UNAUTHORIZED
    });

    expect(baseException).toBeDefined();

    const response = baseException.getResponse();
    expect(response.code).toStrictEqual('all_base_exception');
    expect(response.message).toStrictEqual('All base exception paramters');
    expect(response.title).toStrictEqual('All base title');

    const status = baseException.getStatus();
    expect(status).toStrictEqual(httpStatus.UNAUTHORIZED);
  });
});

describe('BaseException with message interpolation', () => {
  it('should create an instance of a base exception - with simple message interpolation', () => {
    const baseException = new BaseException({
      code: 'error_with_interpolation',
      message: 'String is ${str}, number is ${num} and boolean is ${bool}',
      parameters: { str: 'Question', num: 42, bool: true }
    });

    expect(baseException).toBeDefined();

    const response = baseException.getResponse();
    expect(response.code).toStrictEqual('error_with_interpolation');
    expect(response.message).toStrictEqual('String is Question, number is 42 and boolean is true');
    expect(response.title).toStrictEqual('Base Exception');

    const status = baseException.getStatus();
    expect(status).toStrictEqual(httpStatus.INTERNAL_SERVER_ERROR);

    const code = baseException.getCode();
    expect(code).toStrictEqual('error_with_interpolation');

    const messageParameters = baseException.getMessageParameters();
    expect(messageParameters).toBeDefined();
  });
});
