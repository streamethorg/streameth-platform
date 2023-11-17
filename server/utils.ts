import path from 'path'
import { IEvent } from './model/event'

export const generateId = (key: string) => {
  // all lowercase, no spaces, no special characters
  return key
    ?.trim()
    .replace(/\s/g, '_')
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
}

export const BASE_PATH = path.join(process.cwd(), 'data')
export const PUBLIC_PATH = '../public'

export const IMAGE_BASE_PATH = path.join(process.cwd(), 'public')

export const hasData = ({ event }: { event: IEvent }) => {
  return event.dataImporter !== undefined
}

export const apiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://127.0.0.1:3000/api'
  }
  return 'https://app.streameth.org/api'
}


export const getImageUrl = (image: string) => {
  return `https://github.com/streamethorg/streameth-platform/blob/main/images${image}`
}