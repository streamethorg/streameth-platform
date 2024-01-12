import { NextRequest, NextResponse } from 'next/server'
import Session from '@/lib/utils/session'
import EventController from 'streameth-server/controller/event'
import OrganizationController from 'streameth-server/controller/organization'
import { IOrganization } from 'streameth-server/model/organization'
import { generateId } from 'streameth-server/utils'

/*
 * The events of the organization will also be deleted
 */
export async function DELETE(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const session = await Session.fromRequest(req)
    if (!session) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }

    const organizationId =
      req.nextUrl.searchParams.get('organization')
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization does not exist' },
        { status: 404 }
      )
    }

    const eventController = new EventController()
    const events = await eventController.getAllEventsForOrganization(
      organizationId
    )

    for (const event of events) {
      await eventController.deleteEvent(event.id, organizationId)
    }

    const organizationController = new OrganizationController()
    await organizationController.deleteOrganization(organizationId)

    return NextResponse.json(
      'Organization and events of the organization have been deleted',
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const session = await Session.fromRequest(request)

    if (!session) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }

    const formData: IOrganization = await request.json()
    const organizationController = new OrganizationController()
    await organizationController.editOrganization(formData)

    return NextResponse.json('Organisation has been edited', {
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

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const session = await Session.fromRequest(request)

    if (!session) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }

    const formData: IOrganization = await request.json()
    const organizationId = generateId(formData.name)
    const organizationController = new OrganizationController()

    try {
      await organizationController.getOrganization(organizationId)
      // Organisation exists
      return NextResponse.json(
        { error: 'Organisation already exists' },
        { status: 400 }
      )
    } catch {
      // Organisation doesn't exist, proceed to create
      await organizationController.createOrganization(formData)
      return NextResponse.json('Organization has been created', {
        status: 200,
      })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Malformed request' },
      { status: 400 }
    )
  }
}
