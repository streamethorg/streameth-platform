import { NextResponse } from 'next/server'
import SessionController from '@/server/controller/session'
import StageController from '@/server/controller/stage'
import { ISession } from '@/server/model/session'
import { IStage } from '@/server/model/stage'
import { addBlankSessions, getEarliestTime, getTotalSlots } from '@/utils/api'
import { extractSearchParams } from '@/utils/api'
import EventController from '@/server/controller/event'
import { getEventDays, sessionInDateRange } from '@/utils/time'
import { IEvent } from '@/server/model/event'
export interface StageInfo {
  stage: IStage
  sessions: ISession[]
}

export interface DayInfo {
  timestamp: number
  stages: Record<string, StageInfo>
}

export interface ScheduleInfo {
  days: Record<number, DayInfo>
}

export interface ScheduleResponse {
  data: ScheduleInfo
  earliestTime: number
  totalSlots: number
}

export interface ScheduleSearchParams {
  timestamp?: number
  stage?: string
  currentSession?: boolean
}

export async function GET(request: Request, { params }: { params: { id: string; eventId: string } }): Promise<NextResponse> {
  try {
    const searchParams = extractSearchParams<ScheduleSearchParams>(new URL(request.url).searchParams, ['timestamp', 'stage', 'currentSession'])
    const eventController = new EventController()
    const event = await eventController.getEvent(params.eventId, params.id)
    const allSessions = await fetchAllSessions(params.eventId)
    const earliestTime = getEarliestTime(allSessions)

    const filteredSessions = applyAllFilters(event, allSessions, earliestTime, searchParams)

    const organizedData = await organizeData(filteredSessions, event)

    return NextResponse.json({
      data: organizedData,
      earliestTime,
      totalSlots: getTotalSlots(allSessions, earliestTime),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'An error occurred while fetching sessions.' })
  }
}

async function fetchAllSessions(eventId: string): Promise<ISession[]> {
  const controller = new SessionController()
  return await controller.getAllSessionsForEvent(eventId)
}

function applyAllFilters(event: IEvent, sessions: ISession[], earliestTime: number, params: ScheduleSearchParams): ISession[] {
  return [
    filterByTimestamp(params.timestamp, getEventDays(event.start, event.end)),
    filterByStage(params.stage),
    params.currentSession ? filterByCurrentTime : (s: ISession[]) => s,
    (s: ISession[]) => addBlankSessions(s, earliestTime),
  ].reduce((acc: ISession[], fn: (sessions: ISession[]) => ISession[]) => fn(acc), sessions)
}

function filterByTimestamp(timestamp?: number, eventDays: number[] = []) {
  return (sessions: ISession[]) => {
     if (timestamp) {
    const a = sessions.filter((s) => {
        console.log(sessionInDateRange(eventDays, s.start),  timestamp, sessionInDateRange(eventDays, s.start) == timestamp)
        return sessionInDateRange(eventDays, s.start) == timestamp
      })
      console.log(a)
      return a
    }
    else return sessions
  }
   
}

function filterByStage(stage?: string) {
  return (sessions: ISession[]) => (stage ? sessions.filter((s) => s.stageId === stage) : sessions)
}

function filterByCurrentTime(sessions: ISession[]) {
  const currentTime = Date.now()
  return sessions.filter((s) => s.start > currentTime)
}

async function organizeData(sessions: ISession[], event: IEvent): Promise<ScheduleInfo> {
  const stageController = new StageController()
  const data: ScheduleInfo = {
    days: {},
  }

  // Group sessions by day
  const sessionsByDay: Record<number, ISession[]> = {}
  const eventDays = getEventDays(event.start, event.end)
  for (const session of sessions) {
    const sessionDayTimestamp = sessionInDateRange(eventDays, session.start)
    if (!sessionsByDay[sessionDayTimestamp]) {
      sessionsByDay[sessionDayTimestamp] = []
    }
    sessionsByDay[sessionDayTimestamp].push(session)
  }

  // Process each day
  for (const [sessionDayTimestamp, daySessions] of Object.entries(sessionsByDay)) {
    let dayInfo = data.days[+sessionDayTimestamp]
    if (!dayInfo) {
      dayInfo = { timestamp: +sessionDayTimestamp, stages: {} }
      data.days[+sessionDayTimestamp] = dayInfo
    }

    for (const session of daySessions) {
      let stageInfo = dayInfo.stages[session.stageId]
      if (!stageInfo) {
        const stage = await stageController.getStage(session.stageId, session.eventId)
        stageInfo = { stage, sessions: [] }
        dayInfo.stages[session.stageId] = stageInfo
      }
      stageInfo.sessions.push(session)
    }
  }

  return data
}
