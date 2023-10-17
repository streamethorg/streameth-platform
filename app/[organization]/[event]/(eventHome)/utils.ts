import { ISession } from '@/server/model/session'
import { secondsSinceMidnight } from '@/utils/time'

export const getSlotRange = (session: ISession, earliestTime: number) => {
  const start = (secondsSinceMidnight(new Date(session.start)) - earliestTime) / 60 / 15
  const end = (secondsSinceMidnight(new Date(session.end)) - earliestTime) / 60 / 15
  return { start, end }
}

export const CELL_HEIGHT = 5

export const sessionsSchedulePosition = (sessions: ISession[]) => {
  if (sessions.length === 0) {
    return 0
  }

  const min = Math.min(
    ...sessions.map((session) => {
      return secondsSinceMidnight(new Date(session.start))
    })
  )
  const max = Math.max(...sessions.map((session) => secondsSinceMidnight(new Date(session.end))))
  return {
    min,
    max,
    totalSlots: Math.ceil((max - min) / 60 / 15),
  }
}
