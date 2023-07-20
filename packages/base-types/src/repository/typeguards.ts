import { isCuidString } from '@dk-nodesoft/ts-utils';
import { isObject } from 'lodash';
import type { RepositoryInstance } from './repository.types';

/**
 * Check if object is of type RepositoryInstance
 * @param instance - Object to check
 * @returns true if object is of type RepositoryInstance, otherwise false
 */
export const isRepositoryInstance = (instance: unknown): instance is RepositoryInstance =>
  isObject(instance) && isCuidString((instance as RepositoryInstance).cuid);
