import { NextRequest, NextResponse } from 'next/server'
import EventController from '@/server/controller/event'
import SessionController from '@/server/controller/session'
import Session from '@/utils/session'
import { AddOrUpdateFile } from '@/server/utils/github'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const eventController = new EventController()
  const data = await eventController.getAllEventsForOrganization(params.id)

  return NextResponse.json(
    data.map((org) => {
      return {
        ...org,
        link: `/events/${org.id}`,
      }
    })
  )
}

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const session = await Session.fromRequest(req)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    if (!body.organizationId) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    const eventData = {
      ...body,
      organizationId: params.id,
    }

    // Create event in the fs
    const eventController = new EventController()
    const databaseData = await eventController.createEvent(eventData)

    // Write data to db
    const folderName = `data/events/${body.organizationId}`
    const fileName = `${body.name.replace(/ /g, '_').toLowerCase()}.json`
    await AddOrUpdateFile(fileName, JSON.stringify(body), folderName)

    return NextResponse.json(databaseData, { status: 200 })
  } catch (e) {
    console.error(e)
    return new NextResponse('Malformed request', { status: 400 })
  }
}
