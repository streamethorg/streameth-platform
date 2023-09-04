import { ISession } from '@/server/model/session'
import { secondsSinceMidnight } from '@/utils/time'

export const getSlotRange = (session: ISession, earliestTime: number) => {
  const start = Math.floor((secondsSinceMidnight(new Date(session.start)) - earliestTime) / 60 / 15)
  const end = (secondsSinceMidnight(new Date(session.end)) - earliestTime) / 60 / 15
  console.log('start', start, 'end', end)
  return { start, end }
}

export const CELL_HEIGHT = 4

export const sessionsSchedulePosition = (sessions: ISession[]) => {
  if (sessions.length === 0) {
    return 0 // or some other default value
  }

  const min = Math.min(...sessions.map((session) => secondsSinceMidnight(new Date(session.start))))
  const max = Math.max(...sessions.map((session) => secondsSinceMidnight(new Date(session.end))))
  return {
    min,
    max,
    totalSlots: Math.ceil((max - min) / 60 / 15),
  }
}

export const addBlankSessions = (sessions: ISession[], earliestTime: number): ISession[] => {
  const blankSessions: ISession[] = []
  let lastSession: ISession | undefined

  const createBlankSession = (start: number, end: number, referenceSession: ISession): ISession => ({
    id: `blank${referenceSession.id}`,
    name: 'Blank',
    start,
    end,
    stageId: referenceSession.stageId,
    speakers: [],
    description: '',
    eventId: referenceSession.eventId,
  })

  if (sessions.length > 0 && sessions[0].start > earliestTime) {
    const firstSession = sessions[0]
    blankSessions.push(createBlankSession(firstSession.start - 1, firstSession.start, firstSession))
  }

  for (const session of sessions) {
    if (lastSession) {
      const gap = session.start - lastSession.end
      if (gap > 0) {
        blankSessions.push(createBlankSession(lastSession.end, session.start, lastSession))
      }
    }
    lastSession = session
  }

  return [...sessions, ...blankSessions]
}
