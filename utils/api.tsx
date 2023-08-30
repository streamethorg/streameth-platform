import { ISession } from '@/server/model/session'
import { getTime } from './time'
import { IEvent } from '@/server/model/event'
import { apiUrl } from '@/server/utils'
import { ScheduleData } from '@/app/api/organizations/[id]/events/[eventId]/schedule/route'


export function extractSearchParams<T extends Record<string, any>>(searchParams: URLSearchParams, keys: (keyof T)[]): T {
  const params: Partial<T> = {}
  for (const key of keys) {
    const value = searchParams.get(key as string)
    if (value !== null) {
      params[key] = value as any // Use a type assertion here
    } else {
      params[key] = undefined as any // And here
    }
  }
  return params as T
}

export const addBlankSessions = (sessions: ISession[], earliestTime: number): ISession[] => {
  const blankSessions: ISession[] = []
  let lastSession: ISession | undefined

  const createBlankSession = (start: Date, end: Date, referenceSession: ISession): ISession => ({
    id: `blank${referenceSession.id}`,
    name: 'Blank',
    start,
    end,
    stageId: referenceSession.stageId,
    speakers: [],
    description: '',
    eventId: referenceSession.eventId,
  })

  if (sessions.length > 0 && getTime(sessions[0].start) > earliestTime) {
    const firstSession = sessions[0]
    blankSessions.push(createBlankSession(new Date(earliestTime), firstSession.start, firstSession))
  }

  for (const session of sessions) {
    if (lastSession) {
      const gap = getTime(session.start) - getTime(lastSession.end)
      if (gap > 0) {
        blankSessions.push(createBlankSession(lastSession.end, session.start, lastSession))
      }
    }
    lastSession = session
  }

  return [...sessions, ...blankSessions]
}

export const getEarliestTime = (sessions: ISession[]) => Math.min(...sessions.map((session) => session.start.getTime()))

export const getTotalSlots = (sessions: ISession[], earliestTime: number) =>
  Math.ceil((Math.max(...sessions.map((session) => session.end.getTime()), earliestTime) - earliestTime) / (1000 * 60 * 15))

export const getScheduleData = async ({
  event,
  date,
  stage,
  currentSession,
}: {
  event: IEvent
  date?: string | null
  stage?: string | null
  currentSession?: boolean
}) => {
  const baseUrl = `${apiUrl()}/organizations/${event.organizationId}/events/${event.id}/schedule`
  const params = new URLSearchParams()

  if (date) params.append('date', date)
  if (stage) params.append('stage', stage)
  if (currentSession) params.append('currentSession', 'true')

  const url = `${baseUrl}?${params.toString()}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch schedule')
  }

  const schedule: ScheduleData = await response.json()
  return schedule
}
