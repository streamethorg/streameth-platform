import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'
import SessionsOnSchedule from './SessionsOnGrid'
import { ScheduleContextProvider } from './ScheduleContext'
import StageSelect from './StageSelect'
import DateSelect from './DateSelect'
import { getEventDays } from '@/utils/time'

interface Params {
  params: {
    event: string
    organization: string
  }
}

const SchedulePageComponent = async ({ params }: Params) => {
  const eventController = new EventController()

  const event = await eventController.getEvent(params.event, params.organization)
  const stages = (await new StageController().getAllStagesForEvent(params.event)).map((stage) => stage.toJson())
  const dates = getEventDays(event.start, event.end)

  return (
    <ScheduleContextProvider event={event.toJson()} stages={stages} days={dates}>
      <div id="schedule" className="flex flex-col max-w-7xl w-full mx-auto p-2">
        <span className=" box-border flex flex-col justify-center p-2 bg-white shadow-b w-full my-4 text-5xl">Schedule</span>
        <div className="text-center sticky z-10 flex flex-row space-x-4">
          <DateSelect dates={dates} />
          <StageSelect stages={stages} />
        </div>
        <SessionsOnSchedule />
      </div>
    </ScheduleContextProvider>
  )
}

export default SchedulePageComponent
