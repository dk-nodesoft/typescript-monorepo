/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Logger } from '@nestjs/common';
import type { MongooseModuleOptions } from '@nestjs/mongoose';
import type Bull from 'bull';
import config from 'config';
import _ from 'lodash';
import type { JsonObject, PackageJson } from 'type-fest';
import type { ConfigEndpoint } from './endpoint.type';
import { Environment } from './node-env.util';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly package: PackageJson;
  private readonly processRoot: string;

  constructor() {
    this.processRoot = process.cwd();
    this.package = require(`${this.processRoot}/package.json`);

    // Ensure any local.js file performs an override of objects (config module does a deepmerge)
    // This approach is possible because the config module only renders the config object immutable after the first call to get
    try {
      const localFile = `${this.processRoot}/config/local`;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const local = require(localFile);
      Object.keys(local).forEach((key) => {
        (config as Record<PropertyKey, any>)[key] = local[key];
      });
      this.logger.log(`Using local override located at ${localFile}`);
    } catch (e: unknown) {
      // No additional action required as no local configuration file provided
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getAppRootPath(): string {
    return this.processRoot;
  }

  getPackageName(): string | undefined {
    return this.package.name;
  }

  getPackageVersion(): string | undefined {
    return this.package.version;
  }

  getPackage(): PackageJson {
    return this.package;
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === Environment.development;
  }

  get isTest(): boolean {
    return this.nodeEnv === Environment.test;
  }

  get isProduction(): boolean {
    return this.nodeEnv === Environment.production;
  }

  // eslint-disable-next-line class-methods-use-this
  public has(key: string): boolean {
    return config.has(key);
  }

  // eslint-disable-next-line class-methods-use-this
  public get<T = string>(key: string, dft?: T): T {
    return config.has(key) ? config.get(key) : <T>dft;
  }

  public getNumber(key: string, dftVal?: number): number {
    return +this.get(key) || dftVal || 0;
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.get('fallbackLanguage').toLowerCase();
  }

  getMongooseConfig(): MongooseModuleOptions {
    return {
      uri: this.get('mongo.uri')
    };
  }

  getQueuesConfig(): Bull.QueueOptions {
    return this.get<Bull.QueueOptions>('queues', { redis: { host: 'localhost', port: 6379 } });
  }

  getEndpoint(
    endPoint: string,
    params: {
      [x: string]: string | number;
    }
  ): ConfigEndpoint {
    const endpoint = this.get<ConfigEndpoint>(`endpoints.${endPoint}`);

    if (params) {
      // replace any :param in the url with the value from params
      const finalUrl = _.replace(endpoint.path, /(:\w*)/g, (match) => {
        return _.toString(_.get(params, match.substring(1)) || match);
      });

      return { ...endpoint, finalUrl };
    }

    return endpoint;
  }

  getIBMIConfig(): JsonObject {
    const ibmIConnection = this.get<JsonObject>('ibmi');

    return {
      naming: 'sql',
      'date format': 'iso',
      'keep alive': 'true',
      ...ibmIConnection
    };
  }
}
