export interface StorageRepositoryInterface<T> {
  all(): Promise<T[]>;
  find(cuid: string): Promise<T>;
  put(data: object): Promise<T>;
}
