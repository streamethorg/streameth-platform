import { NextRequest, NextResponse } from 'next/server'
import Session from '@/utils/session'
import OrganizationController from '@/server/controller/organization'
import { IOrganization } from '@/server/model/organization'
import { generateId } from '@/server/utils'
import EventController from '@/server/controller/event'
import { IEvent } from '@/server/model/event'

/*
 * The events of the organization will also be deleted
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const session = await Session.fromRequest(req)
  if (!session) {
    return NextResponse.json('Unauthorized', { status: 401 })
  }

  const organizationId = req.nextUrl.searchParams.get('organization')
  if (!organizationId) {
    return NextResponse.json({ error: 'Organization does not exist' }, { status: 404 })
  }

  const eventController = new EventController()
  const events = await eventController.getAllEventsForOrganization(organizationId)

  events.map((event: IEvent) => {
    eventController.deleteEvent(event.id, organizationId)
  })

  const organizationController = new OrganizationController()
  organizationController.deleteOrganization(organizationId)

  return NextResponse.json('Organization and events of the organization have been deleted', { status: 200 })
}

export async function PATCH(request: NextRequest) {
  const session = await Session.fromRequest(request)

  if (!session) {
    return NextResponse.json('Unauthorized', { status: 401 })
  }

  return request
    .json()
    .then(async (formData: IOrganization) => {
      const organisationController = new OrganizationController()

      return organisationController.editOrganization(formData).then(() => {
        return NextResponse.json('Organisation has been edited', { status: 200 })
      })
    })
    .catch((e) => {
      console.log(e)
      return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
    })
}

export async function POST(request: NextRequest) {
  const session = await Session.fromRequest(request)

  if (!session) {
    return NextResponse.json('Unauthorized', { status: 401 })
  }
  return request
    .json()
    .then(async (formData: IOrganization) => {
      const organisationId = generateId(formData.name)
      const organisationController = new OrganizationController()

      return organisationController
        .getOrganization(organisationId)
        .then(() => {
          // Organisation exists
          return NextResponse.json({ error: 'Organisation already exists' }, { status: 400 })
        })
        .catch(() => {
          // Organisation doesn't exist, proceed to create
          return organisationController.createOrganization(formData)
        })
        .then(() => {
          return NextResponse.json('Organization has been created', { status: 200 })
        })
    })
    .catch((e) => {
      console.log(e)
      return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
    })
}
