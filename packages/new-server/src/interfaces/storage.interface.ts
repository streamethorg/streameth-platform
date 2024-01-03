export interface IStorageController<T> {
  create: (query?: string, data?: T, path?: string) => Promise<T>;
  update?: (id: string, data: T, path?: string) => Promise<T>;
  findById: (id: string, path?: string) => Promise<T>;
  findOne?: (query: {}, path?: string) => Promise<T>;
  findAll: (query?: {}, path?: string) => Promise<Array<T>>;
  delete: (id: string, path?: string) => Promise<void>;
}
