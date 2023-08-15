import EventController from '@/server/controller/event'
import SessionController from '@/server/controller/session'
import SchedulePage from './components/SchedulePage'
import StageController from '@/server/controller/stage'
import { FilterContextProvider } from '../archive/components/FilterContext'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'

const EventPage = async ({
  params,
}: {
  params: {
    organization: string
    event: string
  }
}) => {
  const eventController = new EventController()
  const sessionController = new SessionController()
  const stageController = new StageController()

  try {
    const event = await eventController.getEvent(params.event, params.organization)

    if (!hasData({ event })) return notFound()

    const stages = await stageController.getAllStagesForEvent(event.id)
    const sessions = await sessionController.getAllSessionsForEvent(event.id)

    return (
      <FilterContextProvider items={sessions.map((session) => session.toJson())}>
        <div className="w-full h-full relative md:overflow-scroll">
          <SchedulePage stages={stages.map((stage) => stage.toJson())} event={event.toJson()} />
        </div>
      </FilterContextProvider>
    )
  } catch (e) {
    return notFound()
  }
}

export default EventPage
