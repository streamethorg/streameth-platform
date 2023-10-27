import { AddOrUpdateFile, GetFile } from '@/server/utils/github'
import Session from '@/utils/session'
import { NextRequest, NextResponse } from 'next/server'
import { decode } from 'js-base64'
import SessionController from '@/server/controller/session'

export const POST = async (req: NextRequest) => {
  const sessionController = new SessionController()
  const session = await Session.fromRequest(req)
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  if (!session.nonce || !session.chainId || !session.address) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const body = await req.json()
  if (!body.event || !body.sessions) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  console.log(body)

  for (let i = 0; i < Object.keys(body.sessions).length; i++) {
    const sessionId = Object.keys(body.sessions)[i]
    const fileName = `${sessionId}.json`
    const folderName = `data/sessions/${body.event.id}/${fileName}`
    const data = await sessionController.getSession(
      sessionId,
      body.event.id
    )
    const update = {
      ...data,
      source: body.sessions[sessionId],
    }
    console.log(update)
    await AddOrUpdateFile(
      fileName,
      JSON.stringify(update, null, 2),
      folderName
    )
  }

  return new NextResponse('Ok', { status: 200 })
}
