import { NextRequest, NextResponse } from 'next/server'
import Session from '@/utils/session'
import { IEvent } from '@/server/model/event'
import EventController from '@/server/controller/event'
import { generateId } from '@/server/utils'

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await Session.fromRequest(request)
    if (!session) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }

    const event = request.nextUrl.searchParams.get('event')
    const organizationId = request.nextUrl.searchParams.get('organization')

    if (!event || !organizationId) {
      return NextResponse.json({ error: 'Event or organization does not exist' }, { status: 500 })
    }

    const formData: IEvent = await request.json()
    const eventController = new EventController()
    await eventController.editEvent(formData, organizationId)

    return NextResponse.json('Event has been edited', { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await Session.fromRequest(request)

    if (!session) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }

    const event = request.nextUrl.searchParams.get('event')
    const organization = request.nextUrl.searchParams.get('organization')

    if (!event || !organization) {
      return NextResponse.json({ error: 'Event or organization does not exist' }, { status: 500 })
    }

    const controller = new EventController()
    await controller.deleteEvent(event, organization)

    return NextResponse.json({ message: 'Event has been deleted' }, { status: 200 })
  } catch (err) {
    console.error("An error occurred in 'deleteEvent'", err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await Session.fromRequest(request)

    if (!session) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }

    const eventId = request.nextUrl.searchParams.get('event')
    const organizationId = request.nextUrl.searchParams.get('organization')

    if (!eventId || !organizationId) {
      return NextResponse.json({ error: 'Event or organization does not exist' }, { status: 500 })
    }

    const formData: IEvent = await request.json()
    const generatedEventId = generateId(formData.name)
    const eventController = new EventController()

    try {
      await eventController.getEvent(generatedEventId, organizationId)
      // Event exists
      return NextResponse.json({ error: 'Event already exists' }, { status: 400 })
    } catch {
      // Event doesn't exist, proceed to create
      await eventController.createEvent(formData)
      return NextResponse.json('Event has been created', { status: 200 })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
  }
}
