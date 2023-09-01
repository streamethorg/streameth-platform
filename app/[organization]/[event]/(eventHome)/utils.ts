import { ISession } from '@/server/model/session'
import { secondsSinceMidnight } from '@/utils/time'

export const getSlotRange = (session: ISession, earliestTime: number) => {
  const start = Math.floor((secondsSinceMidnight(new Date(session.start)) - earliestTime) / 60 / 15)
  const end = Math.floor((secondsSinceMidnight(new Date(session.end)) - earliestTime) / 60 / 15)
  return { start, end }
}

export const CELL_HEIGHT = 4
