import { AddOrUpdateFile, GetFile } from '@/server/utils/github'
import Session from '@/utils/session'
import { NextRequest, NextResponse } from 'next/server'
import { decode } from 'js-base64'

export const POST = async (req: NextRequest) => {
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

  for (let i = 0; i < Object.keys(body.sessions).length; i++) {
    const sessionId = Object.keys(body.sessions)[i]
    const folderName = `data/sessions/${body.event.id}`
    const fileName = `${sessionId}.json`
    const file = await GetFile(fileName, folderName)

    if (file) {
      const data = JSON.parse(decode(file.content))
      const update = {
        ...data,
        source: body.sessions[sessionId],
      }

      await AddOrUpdateFile(fileName, JSON.stringify(update, null, 2), folderName)
    }
  }

  return new NextResponse('Ok', { status: 200 })
}
