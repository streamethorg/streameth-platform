import { NextRequest, NextResponse } from 'next/server'
import OrganizationController from '@/server/controller/organization'
import { AddOrUpdateFile } from '@/server/utils/github'
import Session from '@/utils/session'
import EventController from '@/server/controller/event'
import { IEvent } from '@/server/model/event'

/*
 * The events of the organization will also be deleted
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const organizationId = req.nextUrl.searchParams.get('organization')
  console.log(organizationId)

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

  return NextResponse.json({ error: 'Organization and events of the organization have been deleted' }, { status: 200 })
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

export async function POST(request: NextRequest) {
  const organizationController = new OrganizationController()
  try {
    const session = await Session.fromRequest(request)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()

    const environment = process.env.NODE_ENV || 'development'

    if (environment === 'development') {
      // Create event in the fs
      await organizationController.createOrganization(await request.json())
    } else {
      // Write data to db
      const folderName = `data/organizations`
      const fileName = `${body.name.replace(/ /g, '_').toLowerCase()}.json`
      await AddOrUpdateFile(fileName, JSON.stringify(body), folderName)
    }
    return NextResponse.json(body)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
  }
}
