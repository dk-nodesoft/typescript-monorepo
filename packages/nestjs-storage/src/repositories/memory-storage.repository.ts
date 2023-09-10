import { NotFoundException } from '@nestjs/common';
import type { StorageEntry } from '../types/storage-entry.type';
import type { StorageRepositoryInterface } from './storage-repository.interface';

export class MemoryStorageRepository implements StorageRepositoryInterface<StorageEntry> {
  private readonly storage: StorageEntry[] = [];

  public async all(): Promise<StorageEntry[]> {
    return this.storage;
  }

  public async find(cuid: string): Promise<StorageEntry> {
    const entry = this.storage.find((entry) => entry.cuid === cuid);

    if (!entry) {
      throw new NotFoundException(`Storage entry with cuid ${cuid} not found`);
    }

    return entry;
  }

  public async put(data: StorageEntry): Promise<StorageEntry> {
    this.storage.push(data);

    return data;
  }
}
