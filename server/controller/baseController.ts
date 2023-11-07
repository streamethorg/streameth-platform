import FsController from './dataStore/fs'
import fs from 'fs'

interface IBaseController<T> {
  create: (query: string, data: T) => Promise<void>
  get: (query: string) => Promise<T>
  getAll: (query: string) => Promise<T[]>
  // delete: (id: string) => Promise<T>;
}

type StoreType = 'fs' | 'db'

export default class BaseController<T> implements IBaseController<T> {
  store: FsController

  constructor(store: StoreType) {
    switch (store) {
      case 'fs':
        this.store = new FsController()
        break
      // case 'db':
      //   this.store = new DbController();
      //   break;
      default:
        throw new Error(`Unsupported store type: ${store}`)
    }
  }

 mergeObjects(target, source) {
    Object.keys(source).forEach(key => {
      if (source[key] !== undefined) {
        target[key] = source[key];
      }
    });
    return target;
  }
  

  
  async create(query: string, data: T): Promise<void> {
    let existingData: T | null = null

    if (await this.get(query)) {
      const rawData = await this.store.read(query)
      existingData = JSON.parse(rawData)
    } 
    const updatedData = this.mergeObjects(existingData, data)
    return this.store.write(query, JSON.stringify(updatedData))
  }

  async get(query: string): Promise<T> {
    if (fs.lstatSync(query).isDirectory()) {
      console.error(`${query} is a directory, not a file.`)
      process.exit(1)
    }

    return new Promise((resolve, reject) => {
      this.store
        .read(query)
        .then((data) => {
          try {
            const parsedData = JSON.parse(data)
            resolve(parsedData)
          } catch (error) {
            reject(`Error parsing JSON data: ${error}`)
          }
        })
        .catch((error) => {
          reject(`Error reading file: ${error}`)
        })
    })
  }

  async getAll(query: string): Promise<T[]> {
    const files = await this.store.readAll(query)

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

  delete(id: string) {
    this.store.delete(id)
  }
}
