import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'
import SessionsOnSchedule from './components/SessionsOnGrid'
import ScheduleGrid from './components/ScheduleGrid'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import { ScheduleContext, ScheduleContextProvider } from './components/ScheduleContext'
import StageSelect from './components/StageSelect'
import DateSelect from './components/DateSelect'
import { getEventDays } from '@/server/utils'
const EventPage = async ({
  params,
}: {
  params: {
    organization: string
    event: string
  }
}) => {
  const eventController = new EventController()

  try {
    const event = await eventController.getEvent(params.event, params.organization)
    const stages = await new StageController().getAllStagesForEvent(params.event)
    const days = getEventDays(event.start, event.end).map((day) => day.toISOString().split('T')[0])
    if (!hasData({ event })) return notFound()

    return (
      <ScheduleContextProvider event={event} stages={stages} days={days}>
        <div className="w-full h-full relative md:overflow-scroll">
          <div className="sticky top-0 z-10 flex flex-row flex-wrap md:flex-col bg-base justify-center">
            <DateSelect />
            <StageSelect />
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
