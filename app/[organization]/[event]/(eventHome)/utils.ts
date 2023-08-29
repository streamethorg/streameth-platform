import { ISession } from '@/server/model/session'

export const getEarliestTime = (sessions: ISession[]) => Math.min(...sessions.map((session) => session.start.getTime()))

export const getTotalSlots = (sessions: ISession[], earliestTime: number) =>
  Math.ceil((Math.max(...sessions.map((session) => session.end.getTime()), earliestTime) - earliestTime) / (1000 * 60 * 15))

export const getSlotRange = (session: ISession, earliestTime: number) => {
  const start = Math.floor((new Date(session.start).getTime() - earliestTime) / (1000 * 60 * 15))
  const end = Math.ceil((new Date(session.end).getTime() - earliestTime) / (1000 * 60 * 15))
  return { start, end }
}

export const CELL_HEIGHT = 4
