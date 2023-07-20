import { isPlainObject, isPresent } from '@dk-nodesoft/ts-utils';

export type MessagePrimitive = string;
export type MessageCode = string;
export type MessageParameters = Record<PropertyKey, string | number | boolean>;

export type Message = {
  /**
   * A unique code identifying the message
   */
  code: MessageCode;
  /**
   * The actual message
   */
  message: MessagePrimitive;
  /**
   * An optional object representing parameters used for interpolating in the message
   */
  parameters?: MessageParameters;
};

/**
 * Type guard for Message
 * @param v - value check
 * @returns
 */
export const isMessage = (v: unknown): v is Message => {
  return isPlainObject(v) && isPresent(v.code) && isPresent(v.message);
};
