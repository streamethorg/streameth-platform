import { NextResponse } from 'next/server'
import SessionController from '@/server/controller/session'
import { ISession } from '@/server/model/session'
import StageController from '@/server/controller/stage'
import { IStage } from '@/server/model/stage'
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

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string; eventId: string; day?: string; stage?: string }
  }
): Promise<NextResponse> {
  const sessionController = new SessionController();
  const stageController = new StageController();
  try {
    const sessions: ISession[] = await sessionController.getAllSessionsForEvent(params.eventId);
    const earliestTime = getEarliestTime(sessions);

    let filteredSessions: ISession[] =
      params.day || params.stage
        ? sessions.filter(
            (s) => (params.day ? new Date(s.start).toDateString() === params.day : true) && (params.stage ? s.stageId === params.stage : true)
          )
        : sessions;

    filteredSessions = addBlankSessions(filteredSessions, earliestTime);

    const data: DayData[] = await filteredSessions.reduce(async (accPromise: Promise<DayData[]>, session: ISession) => {
      const acc = await accPromise;
      const sessionDay = new Date(session.start).toDateString();
      let dayData = acc.find((d) => d.day === sessionDay);
      if (!dayData) {
        dayData = { day: sessionDay, stages: [] };
        acc.push(dayData);
      }

      let stageData = dayData.stages.find((s) => s.stage.id === session.stageId);
      if (!stageData) {
        const stage = await stageController.getStage(session.stageId, session.eventId);
        stageData = { stage, sessions: [] };
        dayData.stages.push(stageData);
      }

      stageData.sessions.push(session);
      return acc;
    }, Promise.resolve([]));

    // Sort stages based on their order property
    for (const dayData of data) {
      dayData.stages.sort((a, b) => (a.stage.order || 0) - (b.stage.order || 0));
    }

    return NextResponse.json({ data, earliestTime, totalSlots: getTotalSlots(sessions, earliestTime) });
  } catch (e) {
    console.error(e); // Log the error for debugging
    return NextResponse.json({ error: 'An error occurred while fetching sessions.' });
  }
}

