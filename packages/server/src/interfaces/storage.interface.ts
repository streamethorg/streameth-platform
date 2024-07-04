export interface IStorageController<T> {
  create: (query?: string, data?: T, path?: string) => Promise<T>;
  update: (id: string, data: T, query?: string) => Promise<T>;
  findById: (id: string, fields?: {}) => Promise<T>;
  findOne?: (query: {}, path?: string) => Promise<T>;
  findAll: (
    query?: {},
    fields?: {},
    path?: string,
    skip?: number,
    pageSize?: number
  ) => Promise<Array<T>>;
  findAllAndSort?: (
    query?: {},
    path?: string,
    skip?: number,
    pageSize?: number
  ) => Promise<Array<T>>;
  delete: (id: string) => Promise<void>;
}
