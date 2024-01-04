export interface IStorageController<T> {
  create: (query?: string, data?: T, path?: string) => Promise<T>;
  update?: (id: string, data: T) => Promise<T>;
  findById: (id: string) => Promise<T>;
  findOne?: (query: {}, path?: string) => Promise<T>;
  findAll: (query?: {}, path?: string) => Promise<Array<T>>;
  delete: (id: string) => Promise<void>;
}
