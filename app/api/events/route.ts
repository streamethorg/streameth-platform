import { NextResponse, NextRequest } from 'next/server'
import EventController from '@/server/controller/event'
import Session from '@/utils/session'
import { IEvent } from '@/server/model/event'
import { generateId } from '@/server/utils'

export async function DELETE(request: NextRequest): Promise<NextResponse> {
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
  await controller.deleteEvent(event, organization).catch((err) => {
    console.error("An error occured in 'deleteEvent'", err)
  })

  return NextResponse.json({ error: 'Event has been deleted' }, { status: 200 })
}

export async function GET(): Promise<NextResponse> {
  const controller = new EventController()
  const data = await controller.getAllEvents({})

  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const session = await Session.fromRequest(request)

  if (!session) {
    return NextResponse.json('Unauthorized', { status: 401 })
  }

  const event = request.nextUrl.searchParams.get('event')
  const organization = request.nextUrl.searchParams.get('organization')

  if (!event || !organization) {
    return NextResponse.json({ error: 'Event or organization does not exist' }, { status: 500 })
  }

  return request
    .json()
    .then(async (json: any) => {
      const eventController = new EventController()
      const { formData }: { formData: IEvent } = json
      return eventController.editEvent(formData, formData.organizationId).then(() => {
        return NextResponse.json('Event has been edited', { status: 200 })
      })
    })
    .catch((e) => {
      console.log(e)
      return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
    })
}

// POST handler to create a new event
export async function POST(request: NextRequest) {
  const session = await Session.fromRequest(request)

  if (!session) {
    return NextResponse.json('Unauthorized', { status: 401 })
  }

  const eventId = request.nextUrl.searchParams.get('event')
  const organizationId = request.nextUrl.searchParams.get('organization')

  if (!eventId || !organizationId) {
    return NextResponse.json({ error: 'Event or organization does not exist' }, { status: 500 })
  }

  return request
    .json()
    .then(async (json: any) => {
      const { formData }: { formData: IEvent } = json
      const eventId = generateId(formData.name)
      const eventController = new EventController()

      return eventController
        .getEvent(eventId, organizationId)
        .then(() => {
          // Event exists
          return NextResponse.json({ error: 'Event already exists' }, { status: 400 })
        })
        .catch(() => {
          // Event doesn't exist, proceed to create
          return eventController.createEvent(formData)
        })
        .then(() => {
          return NextResponse.json('Event has been created', { status: 200 })
        })
    })
    .catch((e) => {
      console.log(e)
      return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
    })
}
