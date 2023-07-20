/* eslint-disable tsdoc/syntax */
import type { CuidName, ObjectWithCuid, SetCuidOptional } from '@dk-nodesoft/base-types';
import type { SetOptional } from 'type-fest';

/**
 * The abstract type to extend when
 * implementing new repository instance types
 */
export type RepositoryInstance = ObjectWithCuid;

/**
 * RepositoryInstance with cuid set to optional
 * used when implementing create functionality
 */
export type RepositoryInstanceCuidOptional = SetOptional<RepositoryInstance, CuidName>;

/**
 * type util function - Creates a new type from T without cuid property
 * @param T - the RepositoryInstance type
 * @example type { cuid: CuidString; p1: string; } becomes type { p1: string; }
 */
export type RepositoryBase<T extends RepositoryInstance> = Omit<T, CuidName>;

/**
 * type util function - Creates a new type from T with cuid property set to optional
 * @param T - the RepositoryInstance type
 * @example type { cuid: CuidString; p1: string; } becomes type { cuid?: CuidString; p1: string; }
 */
export type RepositoryCreate<T extends RepositoryInstance> = SetCuidOptional<T>;

/**
 * type util function - Creates a type from T without cuid property and rest of
 * properties optional for update purposes.
 * @param T - the RepositoryInstance type
 * @example type { cuid: CuidString; p1: string; } becomes type { p1?: string; }
 */
export type RepositoryUpdate<T extends RepositoryInstance> = Partial<RepositoryBase<T>>;

/**
 * type util function - Creates a type from T without cuid property and rest of
 * properties optional for filtering purposes.
 * @param T - the RepositoryInstance type
 * @example type { cuid: CuidString; p1: string; } becomes type { p1?: string; }
 */
export type RepositoryFilter<T extends RepositoryInstance> = Partial<RepositoryBase<T>>;
