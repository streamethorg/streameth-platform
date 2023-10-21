import FsController from './dataStore/fs'
import fs from 'fs'
import { getEnvironment } from '../utils'
import DbController from './dataStore/db'

interface IBaseController<T> {
  create: (query: string, data: T) => Promise<void>
  get: (query: string) => Promise<T>
  getAll: (query: string) => Promise<T[]>
  // update: (id: string, data: T) => Promise<T>;
  delete: (id: string) => void
}

type StoreType = 'fs' | 'db'

export default class BaseController<T> implements IBaseController<T> {
  store: FsController | DbController

  constructor(store: StoreType) {
    switch (store) {
      case 'fs':
        this.store = new FsController()
        break
      case 'db':
        this.store = new DbController()
        break
      default:
        throw new Error(`Unsupported store type: ${store}`)
    }
  }

  async create(query: string, data: T): Promise<void> {
    return this.store.write(query, JSON.stringify(data))
  }

  async get(query: string): Promise<T> {
    if (getEnvironment() == 'fs' && fs.lstatSync(query).isDirectory()) {
      console.error(`${query} is a directory, not a file.`)
      process.exit(1)
    }

    return this.store.read(query).then((data) => JSON.parse(data))
  }

  async getAll(query: string): Promise<T[]> {
    const files = await this.store.readAll(query)
    if (files == undefined) {
      return []
    }
    const dataPromises = files.map(async (file) => {
      const data = await this.store.read(`${query}/${file}`)
      try {
        return JSON.parse(data)
      } catch (e) {
        console.error(`Error parsing JSON from ${query}/${file}`)
        throw e
      }
    })
    return Promise.all(dataPromises)
  }

  // update(id: string, data: T): Promise<T> {
  //   return this.store.update(id, data);
  // }

  delete(id: string, organizationId?: string) {
    this.store.delete(id, organizationId)
  }
}
