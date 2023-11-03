import { NextRequest, NextResponse } from 'next/server'
import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'

export async function GET(request: NextRequest) {
  const controller = new EventController()
  const data = await controller.getAllEvents({})

  const searchParams = request.nextUrl.searchParams
  const inclStages = Boolean(searchParams.get('inclStages') === 'true')
  if (inclStages) {
    const stageController = new StageController()
    const eventsWithStages = await Promise.all(
      data.map(async (event) => {
        const stages = await stageController.getAllStagesForEvent(event.id)
        return {
          ...event,
          stages
        }
      })
    )

    return NextResponse.json(eventsWithStages)
  }

  return NextResponse.json(data)
}
