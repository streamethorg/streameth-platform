import { NextRequest, NextResponse } from 'next/server'
import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const inclStages = Boolean(
    searchParams.get('inclStages') === 'true'
  )
  const inclUnlisted = Boolean(
    searchParams.get('inclUnlisted') === 'true'
  )

  const controller = new EventController()
  const data = await controller.getAllEvents({ inclUnlisted: inclUnlisted })

  if (inclStages) {
    const stageController = new StageController()
    const eventsWithStages = await Promise.all(
      data.map(async (event) => {
        const stages = await stageController.getAllStagesForEvent(
          event.id
        )
        return {
          ...event,
          stages,
        }
      })
    )

    return NextResponse.json(eventsWithStages)
  }

  return NextResponse.json(data)
}
