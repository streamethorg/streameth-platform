import path from 'path'
import { IEvent } from './model/event'
import { StoreType } from './controller/baseController'


export const generateId = (key: string) => {
  // all lowercase, no spaces, no special characters
  return key
    .trim()
    .replace(/\s/g, '_')
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
}

const environment = process.env.NODE_ENV || 'development'

export const getEnvironment = (): StoreType => {
  // if (environment === 'development') return 'fs'
  return 'db'
}

export const getBasePath = () => {
  if (environment === 'development')
    // return path.join(process.cwd(), 'data')
  return 'data'
}

export const BASE_PATH = getBasePath()
export const PUBLIC_PATH = 'public'

export const IMAGE_BASE_PATH =
  environment === 'development'
    ? path.join(process.cwd(), 'public')
    : 'public'
// export const IMAGE_BASE_PATH = path.join(process.cwd(), 'public')

export const hasData = ({ event }: { event: IEvent }) => {
  return event.dataImporter !== undefined
}

export const apiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://127.0.0.1:3000/api'
  }
  return 'https://app.streameth.org/api'
}
