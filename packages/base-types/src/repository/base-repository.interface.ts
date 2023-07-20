import type { ObjectWithCuid, SetCuidOptional } from '@dk-nodesoft/base-types';
import type { CuidString } from '@dk-nodesoft/ts-utils';
import type { RepositoryInstance } from './repository.types';

/**
 * T: Database row type (e.g. Mongoose document). Including cuid
 */
export interface IBaseRepository<T extends RepositoryInstance> {
  create<S extends SetCuidOptional<ObjectWithCuid> = SetCuidOptional<T>>(data: S): Promise<CuidString>;
  findByCuidWithPopulate(cuid: CuidString, select?: unknown): Promise<T>;
}
