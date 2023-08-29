import path from 'path'
import { IEvent } from './model/event'
import { ISession } from './model/session'
export const getEventDays = (start: Date, end: Date): Date[] => {
  // Calculate the difference in days between the two dates
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Generate the date options
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
    dates.push(date)
  }

  return dates
}

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

export const IMAGE_BASE_PATH = path.join(process.cwd(), 'public')

export const hasData = ({ event }: { event: IEvent }) => {
  return event.dataImporter !== undefined
}

export const apiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/api'
  }
  return 'https://app.streameth.org/api'
}

export const addBlankSessions = (sessions: ISession[], earliestTime: number) => {
  const blankSessions: ISession[] = []
  let lastSession: ISession | undefined
  if (sessions[0]?.start.getTime() > earliestTime) {
    blankSessions.push({
      id: 'blank' + (sessions[0]?.id || 'start'),
      name: 'Blank',
      start: new Date(earliestTime),
      end: new Date(sessions[0].start.getTime()),
      stageId: sessions[0]?.stageId || '',
      speakers: [],
      description: '',
      eventId: sessions[0]?.eventId || '',
    })
  }

  for (const session of sessions) {
    if (lastSession && session.start.getTime() - lastSession.end.getTime() > 0) {
      blankSessions.push({
        id: 'blank' + lastSession.id,
        name: 'Blank',
        start: lastSession.end,
        end: session.start,
        stageId: lastSession.stageId,
        speakers: [],
        description: '',
        eventId: lastSession.eventId,
      })
    }
    lastSession = session
  }
  return [...sessions, ...blankSessions]
}

export const getEarliestTime = (sessions: ISession[]) => Math.min(...sessions.map((session) => session.start.getTime()))

export const getTotalSlots = (sessions: ISession[], earliestTime: number) =>
  Math.ceil((Math.max(...sessions.map((session) => session.end.getTime()), earliestTime) - earliestTime) / (1000 * 60 * 15))
