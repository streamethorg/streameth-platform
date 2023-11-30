
import Session from '@/utils/session'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import SessionController from '../../../../../server/controller/session'
import { AddOrUpdateFile } from '../../../../../server/utils/github'

export const POST = async (req: NextRequest) => {
  const session = await Session.fromRequest(req)
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  if (!session.nonce || !session.chainId || !session.address) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const body = await req.json()
  const folderName = `data/sessions/${body.eventId}`
  const fileName = `${body.sessionId}.json`
  const sessionController = new SessionController()
  const data = await sessionController.getSession(
    body.sessionId,
    body.eventId
  )

  const update = {
    ...data,
    assetId: body.assetId,
    playbackId: body.playbackId,
    sourceId: body.sourceId,
    videoUrl: body.videoUrl,
    videoType: body.videoType,
  }
  await AddOrUpdateFile(
    fileName,
    JSON.stringify(update, null, 2),
    folderName
  )

  // revalidate Event page
  revalidatePath(`/${body.organizationId}/${body.eventId}/archive`)

  return new NextResponse('Ok', { status: 200 })
}
