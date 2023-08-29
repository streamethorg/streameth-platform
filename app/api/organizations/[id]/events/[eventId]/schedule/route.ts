import { NextResponse } from 'next/server'
import SessionController from '@/server/controller/session'
import StageController from '@/server/controller/stage'
import { ISession } from '@/server/model/session'
import { IStage } from '@/server/model/stage'
import { addBlankSessions, getEarliestTime, getTotalSlots } from '@/server/utils'

interface StageData {
  stage: IStage
  sessions: ISession[]
}

export interface DayData {
  day: string
  stages: StageData[]
}

export interface ScheduleData {
  data: DayData[]
  earliestTime: number
  totalSlots: number
}

type SearchParamsItems = {
  day?: string
  stage?: string
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string; eventId: string }
  }
): Promise<NextResponse> {
  try {
    const searchParams = new URL(request.url).searchParams
    const day = searchParams.get('day') ?? undefined
    const stage = searchParams.get('stage') ?? undefined
    const sessionController = new SessionController()
    const stageController = new StageController()

    const sessions: ISession[] = await sessionController.getAllSessionsForEvent(params.eventId)
    const earliestTime = getEarliestTime(sessions)

    let filteredSessions = filterSessionsByDayAndStage(sessions, day, stage)
    filteredSessions = addBlankSessions(filteredSessions, earliestTime)

    const data: DayData[] = await organizeSessionsByDayAndStage(filteredSessions, stageController)

    // Sort stages based on their order property
    sortStagesByOrder(data)

    return NextResponse.json({ data, earliestTime, totalSlots: getTotalSlots(sessions, earliestTime) })
  } catch (e) {
    console.error(e) // Log the error for debugging
    return NextResponse.json({ error: 'An error occurred while fetching sessions.' })
  }
}

function filterSessionsByDayAndStage(sessions: ISession[], day?: string, stage?: string): ISession[] {
  console.log(day, stage)
  return day || stage
    ? sessions.filter((s) => (day ? date(s.start) === day : true) && (stage ? s.stageId === stage : true))
    : sessions
}

async function organizeSessionsByDayAndStage(filteredSessions: ISession[], stageController: StageController): Promise<DayData[]> {
  return await filteredSessions.reduce(async (accPromise: Promise<DayData[]>, session: ISession) => {
    const acc = await accPromise
    const sessionDay = date(session.start)
    let dayData = acc.find((d) => d.day === sessionDay)
    if (!dayData) {
      dayData = { day: sessionDay, stages: [] }
      acc.push(dayData)
    }

    let stageData = dayData.stages.find((s) => s.stage.id === session.stageId)
    if (!stageData) {
      const stage = await stageController.getStage(session.stageId, session.eventId)
      stageData = { stage, sessions: [] }
      dayData.stages.push(stageData)
    }

    stageData.sessions.push(session)
    return acc
  }, Promise.resolve([]))
}

function sortStagesByOrder(data: DayData[]): void {
  for (const dayData of data) {
    dayData.stages.sort((a, b) => (a.stage.order || 0) - (b.stage.order || 0))
  }
}

export const date = (date: Date) => new Date(date).toISOString().split('T')[0]
