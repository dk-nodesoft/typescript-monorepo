/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor() {}

  public async put() {}

  public async get() {}

  public async delete() {}

  public async authenticate() {}

  public async url() {}

  public async urlSigned() {}
}
