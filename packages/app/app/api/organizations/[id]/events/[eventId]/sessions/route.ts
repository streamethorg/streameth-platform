import { NextResponse } from 'next/server'
import { extractSearchParams } from '@/lib/utils/api'
import SessionController from 'streameth-server/controller/session'

export interface SessionsSearchParams {
  timestamp?: string
  stage?: string
  date?: string
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string; eventId: string }
  }
) {
  const searchParams = extractSearchParams<SessionsSearchParams>(
    new URL(request.url).searchParams,
    ['timestamp', 'date', 'stage']
  )
  const sessionController = new SessionController()
  try {
    //params.eventId, searchParams.stage, Number(searchParams.timestamp), Number(searchParams.date))
    const data = await sessionController.getAllSessions({
      eventId: params.eventId,
      stage: searchParams.stage,
      timestamp: Number(searchParams.timestamp),
      date: searchParams.date
        ? new Date(searchParams.date)
        : undefined,
    })
    return NextResponse.json(data)
  } catch (e) {
    console.log(e)
    return NextResponse.json({})
  }
}
