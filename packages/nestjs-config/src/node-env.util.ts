export enum Environment {
  development = 'development',
  test = 'test',
  production = 'production'
}

export const getNodeEnv = (): Environment => (process.env.NODE_ENV as Environment) || Environment.development;

export const isDevelopment = (): boolean => getNodeEnv() === Environment.development;

export const isTest = (): boolean => getNodeEnv() === Environment.test;

export const isProduction = (): boolean => getNodeEnv() === Environment.production;
