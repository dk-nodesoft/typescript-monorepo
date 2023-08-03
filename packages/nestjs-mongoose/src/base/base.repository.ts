import { InstanceExistException, InstanceNotFoundException } from '@dk-nodesoft/base-exceptions';
import type { IBaseRepository, IdString, ObjectWithCuid, SetCuidOptional } from '@dk-nodesoft/base-types';
import { CUID_NAME } from '@dk-nodesoft/base-types';
import type { CuidString } from '@dk-nodesoft/ts-utils';
import { createCuid, isCuidString } from '@dk-nodesoft/ts-utils';
import { Logger } from '@nestjs/common';
import type { Types } from 'mongoose';
import type {
  MongooseInstance,
  MongooseInternal,
  MongooseSelectInstance,
  ObjectWithIdInternal,
  MongooseModel
} from '../types';
import { ID_NAME_INTERNAL } from '../types';
import { toObjectIdStrict } from '../utils';
import { createSelectFromModel } from '../utils/model';

/**
 * Base model repository for mongoose access. Used for all mongoose repositories.
 * Contains methods that must be available for every model.
 * T: Mongoose document without id
 * U: Mongoose internal document [optional] - defaults to T
 */
export abstract class BaseRepositoryMongo<T extends MongooseInstance, U extends MongooseInstance = T>
  implements IBaseRepository<T>
{
  protected logger: Logger = new Logger(BaseRepositoryMongo.name);
  protected instanceSelect: MongooseSelectInstance<U> | null = null;

  protected constructor(private model: MongooseModel<U>) {}

  protected getInstanceSelect(): MongooseSelectInstance<U> {
    if (!this.instanceSelect) {
      this.instanceSelect = createSelectFromModel<U>(this.model);
    }

    return this.instanceSelect;
  }

  /**
   * Create document
   * @param data - to be inserted
   * @returns cuid of inserted document or throws an error if document already exists
   * @throws InstanceExistException if document already exists
   */
  public async create<S extends SetCuidOptional<ObjectWithCuid> = SetCuidOptional<T>>(data: S): Promise<CuidString> {
    if (!isCuidString(data[CUID_NAME])) {
      data[CUID_NAME] = createCuid();
    }

    try {
      await this.model.create(data);
    } catch (err: unknown) {
      throw new InstanceExistException('Instance already exists');
    }

    return data[CUID_NAME];
  }

  /**
   * Find Document by cuid
   * @param cuid - CuidString
   * @returns Lean Mongo document with selected fields
   * @throws InstanceNotFoundException if Document doesn't exist
   */
  public async findByCuidWithPopulate(cuid: CuidString): Promise<T> {
    const select = this.getInstanceSelect();
    let doc: T | MongooseInternal<T> | null;

    const query = this.model.findOne({ cuid }).select(select);

    if (ID_NAME_INTERNAL in select && select[ID_NAME_INTERNAL] === 1) {
      doc = await query.lean<MongooseInternal<T>>();
    } else {
      doc = await query.lean<T>();
    }

    if (!doc) {
      throw new InstanceNotFoundException({ cuid });
    }

    return doc as T;
  }

  /**
   * get the internal mongo-id as string
   * @param cuid - the unique cuid
   * @returns IdString
   */
  public async getId(cuid: CuidString): Promise<IdString> {
    const doc = await this.model.findOne({ cuid }).select({ _id: 1 }).lean<ObjectWithIdInternal>();

    if (!doc) {
      throw new InstanceNotFoundException({ cuid });
    }

    return doc._id;
  }

  /**
   * map array of cuid's to array of mongo-id strings
   * @param cuids - the unique cuids to map
   * @returns IdString
   */
  public async mapToIds(cuids: CuidString[]): Promise<IdString[]> {
    const docs = await this.model
      .find({ cuid: { $in: cuids } })
      .select({ _id: 1 })
      .lean<ObjectWithIdInternal[]>();

    return docs.map((doc) => doc._id);
  }

  /**
   * get the internal mongo-id as mongo object-id
   * @param cuid - the unique cuid
   * @returns Types.ObjectId
   */
  public async getObjectId(cuid: CuidString): Promise<Types.ObjectId> {
    const id = await this.getId(cuid);

    return toObjectIdStrict(id);
  }

  /**
   * map array of cuid's to array of mongo object-id's
   * @param cuids - the unique cuids to map
   * @returns Types.ObjectId[]
   */
  public async mapToObjectIds(cuids: CuidString[]): Promise<Types.ObjectId[]> {
    const docs = await this.model
      .find({ cuid: { $in: cuids } })
      .select({ _id: 1 })
      .lean<ObjectWithIdInternal[]>();

    return docs.map((doc) => toObjectIdStrict(doc._id));
  }
}
