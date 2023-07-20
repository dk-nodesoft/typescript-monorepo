/* eslint-disable @typescript-eslint/naming-convention */
import type { RepositoryInstance } from '@dk-nodesoft/base-types';
import { createCuid } from '@dk-nodesoft/ts-utils';
import { ObjectId } from 'mongodb';
import type { MongooseExternal, MongooseInternal } from '../../types';
import { internalToExternalId } from '../id';

describe('mongoose id util', () => {
  it('should be defined', () => {
    expect(internalToExternalId).toBeDefined();
  });

  it('should convert internal to external id', async () => {
    type TestObject = RepositoryInstance & {
      name: string;
      age: number;
    };
    type TestInternal = MongooseInternal<TestObject>;
    type TestExternal = MongooseExternal<TestObject>;

    const name = 'test';
    const age = 32;
    const cuid = createCuid();
    const id = new ObjectId().toString();
    const testInstanceInternal: TestInternal = {
      _id: id,
      cuid,
      name,
      age
    };
    const testInstanceExternal: TestExternal = {
      id,
      cuid,
      name,
      age
    };

    const result = internalToExternalId<TestExternal>(testInstanceInternal);

    expect(result).toStrictEqual(testInstanceExternal);
  });
});
