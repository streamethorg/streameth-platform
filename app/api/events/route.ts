import { NextResponse, NextRequest } from 'next/server'
import EventController from '@/server/controller/event'

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const event = req.nextUrl.searchParams.get('event')
  const organization = req.nextUrl.searchParams.get('organization')

  if (!event || !organization) {
    return NextResponse.json({ error: 'Event or organization does not exist' }, { status: 500 })
  }

  const controller = new EventController()
  await controller.deleteEvent(event, organization).catch((err) => {
    console.error("An error occured in 'deleteEvent'", err)
  })

  return NextResponse.json({ error: 'Event has been deleted' }, { status: 200 })
}

export async function GET(): Promise<NextResponse> {
  const controller = new EventController()
  const data = await controller.getAllEvents()

  return NextResponse.json(data)
}
