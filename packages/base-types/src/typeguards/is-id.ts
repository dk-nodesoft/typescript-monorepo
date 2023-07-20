import { isString } from '@dk-nodesoft/ts-utils';
import type { IdString } from '../types';

export const ID_BYTE_LENGTH = Buffer.byteLength('012345678901234567890123');

/**
 * Validate that id is a string and a valid mongodb id
 * @param id - the parameter to be validated
 * @returns boolean
 */
export const isIdString = (id: unknown): id is IdString => isString(id) && Buffer.byteLength(id) === ID_BYTE_LENGTH;
