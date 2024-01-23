import { NextRequest, NextResponse } from 'next/server'
import Session from '@/lib/utils/session'
import EventController from 'streameth-server/controller/event'
import { IEvent } from '@/lib/types'
import { generateId } from 'streameth-server/utils'

export async function GET(
  request: Request,
  { params }: { params: { id: string; eventId: string } }
) {
  const eventController = new EventController()
  try {
    const data = await eventController.getEvent(
      params.eventId,
      params.id
    )
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({})
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
): Promise<NextResponse> {
  try {
    const session = await Session.fromRequest(request)
    const { id: organizationId, eventId: event } = params
    if (!session) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }

    if (!event || !organizationId) {
      return NextResponse.json(
        { error: 'Event or organization does not exist' },
        { status: 404 }
      )
    }

    const formData: IEvent = await request.json()
    const eventController = new EventController()
    await eventController.editEvent(formData, organizationId)

    return NextResponse.json('Event has been edited', { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Malformed request' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
): Promise<NextResponse> {
  try {
    const session = await Session.fromRequest(request)
    const { id: organizationId, eventId: event } = params

    if (!session) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }

    if (!event || !organizationId) {
      return NextResponse.json(
        { error: 'Event or organization does not exist' },
        { status: 500 }
      )
    }
    const generatedEventId = generateId(event)
    const controller = new EventController()
    await controller.deleteEvent(generatedEventId, organizationId)

    return NextResponse.json(
      { message: 'Event has been deleted' },
      { status: 200 }
    )
  } catch (err) {
    console.error("An error occurred in 'deleteEvent'", err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
): Promise<NextResponse> {
  try {
    const session = await Session.fromRequest(request)
    const { id: organizationId, eventId: event } = params

    if (!session) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }

    if (!event || !organizationId) {
      return NextResponse.json(
        { error: 'Event or organization does not exist' },
        { status: 500 }
      )
    }

    const formData: IEvent = await request.json()
    const generatedEventId = generateId(formData.name)
    const eventController = new EventController()

    // Event doesn't exist, proceed to create
    await eventController.createEvent(formData)
    return NextResponse.json('Event has been created', {
      status: 200,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Malformed request' },
      { status: 400 }
    )
  }
}
