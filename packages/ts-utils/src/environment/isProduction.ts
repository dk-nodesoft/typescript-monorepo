/**
 * Returns `true` if in development environment otherwise `false`
 * @return {Boolean}
 */
import { Environment } from './environments.type';

export const isProduction = (): boolean => !process.env.NODE_ENV || process.env.NODE_ENV === Environment.PRODUCTION;
