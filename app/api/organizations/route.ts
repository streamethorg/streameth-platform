import { NextRequest, NextResponse } from 'next/server'
import OrganizationController from '@/server/controller/organization'
import { AddOrUpdateFile } from '@/server/utils/github'
import Session from '@/utils/session'
import EventController from '@/server/controller/event'
import { IEvent } from '@/server/model/event'
import { IOrganization } from '@/server/model/organization'
import { generateId } from '@/server/utils'

/*
 * The events of the organization will also be deleted
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
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

export async function GET() {
  const organizationController = new OrganizationController()
  const data = await organizationController.getAllOrganizations()

  return NextResponse.json(
    data.map((org) => {
      return {
        ...org,
        link: `/organizations/${org.id}`,
      }
    })
  )
}

export function PATCH(request: NextRequest) {
  Session.fromRequest(request)
    .then((session) => {
      if (!session) {
        return new NextResponse('Unauthorized', { status: 401 })
      }
      return request.json()
    })
    .then(async (organisation: IOrganization) => {
      const organisationController = new OrganizationController()

      return organisationController.editOrganization(organisation).then(() => {
        return NextResponse.json('Organisation has been edited', { status: 200 })
      })
    })
    .catch((e) => {
      console.log(e)
      return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
    })
}

export function POST(request: NextRequest) {
  Session.fromRequest(request)
    .then((session) => {
      if (!session) {
        return new NextResponse('Unauthorized', { status: 401 })
      }

      return request.json()
    })
    .then(async (organisation: IOrganization) => {
      const organisationId = generateId(organisation.name)
      const organisationController = new OrganizationController()

      return organisationController
        .getOrganization(organisationId)
        .then(() => {
          // Organisation exists
          return NextResponse.json({ error: 'Organisation already exists' }, { status: 400 })
        })
        .catch(() => {
          // Organisation doesn't exist, proceed to create
          return organisationController.createOrganization(organisation)
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
