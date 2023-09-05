import { NextResponse } from 'next/server'
import SessionController from '@/server/controller/session'
import { extractSearchParams } from '@/utils/api'

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
  const searchParams = extractSearchParams<SessionsSearchParams>(new URL(request.url).searchParams, ['timestamp', 'date', 'stage'])
  const sessionController = new SessionController()
  try {
    const data = await sessionController.getAllSessions(params.eventId, searchParams.stage, Number(searchParams.timestamp), Number(searchParams.date))
    return NextResponse.json(data)
  } catch (e) {
    console.log(e)
    return NextResponse.json({})
  }
}
