import path from 'path'
import { IEvent } from './model/event'
export const generateId = (key: string) => {
  // all lowercase, no spaces, no special characters
  return key
    .trim()
    .replace(/\s/g, '_')
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
}

export const BASE_PATH = path.join(process.cwd(), 'data')
// export const BASE_PATH = "../data";
export const PUBLIC_PATH = '../public'

export const hasData = ({ event }: { event: IEvent }) => {
  return event.dataImporter !== undefined
}
