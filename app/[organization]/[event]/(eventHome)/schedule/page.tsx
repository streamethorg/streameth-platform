import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'
import SessionsOnSchedule from './components/SessionsOnGrid'
import ScheduleGrid from './components/ScheduleGrid'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import { ScheduleContextProvider } from './components/ScheduleContext'
import StageSelect from './components/StageSelect'
import DateSelect from './components/DateSelect'
import { getEventDays } from '@/utils/time'
import type { Metadata, ResolvingMetadata } from 'next'

interface Params {
  params: {
    event: string
    organization: string
  }
}

const EventPage = async ({ params }: Params) => {
  const eventController = new EventController()

  try {
    const event = await eventController.getEvent(
      params.event,
      params.organization
    )
    const stages = (
      await new StageController().getAllStagesForEvent(params.event)
    ).map((stage) => stage.toJson())
    const dates = getEventDays(event.start, event.end)
    if (!hasData({ event })) return notFound()

    return (
      <ScheduleContextProvider
        event={event.toJson()}
        stages={stages}
        days={dates}>
        <div className="w-full h-full relative md:overflow-scroll">
          <div className="sticky top-0 z-10 flex flex-row flex-wrap md:flex-col bg-base justify-center">
            <DateSelect dates={dates} />
            <StageSelect stages={stages} />
          </div>
          <ScheduleGrid>
            <SessionsOnSchedule />
          </ScheduleGrid>
        </div>
      </ScheduleContextProvider>
    )
  } catch (e) {
    console.log(e)
    return notFound()
  }
}

export default EventPage

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const eventController = new EventController()
  const event = await eventController.getEvent(
    params.event,
    params.organization
  )
  const imageName = event.eventCover
    ? event.eventCover
    : event.id + '.png'
  const imageUrl = 'https://app.streameth.org/public/' + imageName

  return {
    title: `${event.name} - Home`,
    description: `Attend ${event.name} virtually powered by streameth here`,
    openGraph: {
      images: [imageUrl],
    },
  }
}
