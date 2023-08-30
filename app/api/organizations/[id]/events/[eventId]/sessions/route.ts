import { NextResponse } from 'next/server'
import SessionController from '@/server/controller/session'
import { ISession } from '@/server/model/session'

interface urlParams {
  sessionId?: string
  stage?: string
}

interface returnData {
  sessions: ISession[]
  currentSession?: ISession
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string; eventId: string }
  }
) {
  const sessionController = new SessionController()
  try {
    const data = await sessionController.getAllSessionsForEvent(params.eventId)
    return NextResponse.json(data)
  } catch (e) {
    console.log(e)
    return NextResponse.json({})
  }
}
