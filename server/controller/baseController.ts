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

  private mergeObjects(target: any, source: any): any {
    Object.keys(source).forEach((key) => {
      const sourceKey = key as keyof T
      if (source[sourceKey] !== undefined) {
        // Only overwrite if the value is not undefined
        target[sourceKey] = source[sourceKey]
      }
    })
    return target // Return the modified target object
  }

  public async create(query: string, data: T): Promise<void> {
    let existingData: T | null = null
    // read the existing data
    const existingDataString = await this.store.read(query)

    if (existingDataString) {
      existingData = JSON.parse(existingDataString)
    }

    // If no existing data is found, create new data
    if (!existingData) {
      existingData = {} as T // Create an empty object if no existing data is found
    }

    const updatedData = this.mergeObjects(existingData, data)

    await this.store.write(query, JSON.stringify(updatedData))
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
