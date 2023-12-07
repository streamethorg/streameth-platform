import SessionsOnSchedule from './SessionsOnGrid'
import { ScheduleContextProvider } from './ScheduleContext'
import StageSelect from './StageSelect'
import DateSelect from './DateSelect'
import { getEventDays } from '@/utils/time'
import ComponentWrapper from '../../components/ComponentWrapper'
import StageController from 'streameth-server/controller/stage'
import EventController from 'streameth-server/controller/event'
import SessionController from 'streameth-server/controller/session'
import SectionTitle from '../../components/SectionTitle'
interface Params {
  params: {
    event: string
    organization: string
  }
}

const SchedulePageComponent = async ({ params }: Params) => {
  const eventController = new EventController()

  const event = await eventController.getEvent(
    params.event,
    params.organization
  )
  const stages = (
    await new StageController().getAllStagesForEvent(params.event)
  ).map((stage) => stage.toJson())
  const dates = getEventDays(event.start, event.end)
  const sessions = await new SessionController().getAllSessions({
    eventId: params.event,
  })

  if (!sessions.length) return null
  return (
    <ComponentWrapper sectionId="schedule">
      <ScheduleContextProvider
        event={event.toJson()}
        stage={stages[0]?.id}
        sessions={sessions.map((session) => session.toJson())}>
        <div className=" flex flex-col md:flex-row w-full rounded-lg z-50 space-y-2 md:space-y-0 md:space-x-2 mb-4 justify-center">
          <SectionTitle title="Schedule" />
          <DateSelect dates={dates} />
          <StageSelect stages={stages} />
        </div>
        <SessionsOnSchedule />
      </ScheduleContextProvider>
    </ComponentWrapper>
  )
}

export default SchedulePageComponent
