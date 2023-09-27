import { NextResponse } from 'next/server'
import EventController from '@/server/controller/event'

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

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const eventController = new EventController()
  try {
    const eventData = {
      ...(await request.json()),
      organizationId: params.id,
    }

    const data = await eventController.createEvent(eventData)
    return NextResponse.json(data)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
  }
}
