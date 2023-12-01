import { NextResponse } from 'next/server'
import EventController from '@server/controller/event'
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventController = new EventController()
  const data = await eventController.getAllEventsForOrganization(
    params.id
  )

  return NextResponse.json(
    data.map((org) => {
      return {
        ...org,
        link: `/events/${org.id}`,
      }
    })
  )
}
