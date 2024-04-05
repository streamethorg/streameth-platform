import StageSelect from './StageSelect'
import DateSelect from './DateSelect'
import SessionList from '@/components/sessions/SessionList'
import { fetchAllSessions } from '@/lib/data'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { getEventDays, getSessionDays } from '@/lib/utils/time'
import { isSameDay } from '@/lib/utils/time'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IExtendedEvent } from '@/lib/types'

const ScheduleComponent = async ({
  stages,
  event,
  stage,
  date,
}: {
  stages: IStageModel[]
  event: IExtendedEvent
  stage?: string
  date?: string
}) => {
  const sessionsData = await fetchAllSessions({
    event: event.slug,
    stageId: stage ?? stages[0]?.id,
  })

  const dates = getSessionDays(sessionsData.sessions)
  const sessions = sessionsData.sessions.filter((session) => {
    if (date) {
      if (date === 'all') return true
      return isSameDay(session.start, Number(date))
    }
    return isSameDay(session.start, Number(dates[0]))
  })

  if (!sessionsData.sessions.length) return null

  return (
    <Card id="schedule" className="shadow-none border-none">
      <CardHeader className=" flex flex-col lg:flex-row w-full space-y-2 lg:space-y-0 lg:space-x-4 justify-start">
        <DateSelect dates={dates} />
        <StageSelect stages={stages} />
      </CardHeader>
      <CardContent className="">
        <div className="w-full flex flex-col relative">
          <SessionList
            date={date}
            event={event}
            sessions={sessions}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export const ScheduleSkeleton = () => (
  <div className="text-white bg-opacity-[0.04] bg-white border-white border-opacity-[0.04] lg:rounded-xl shadow animate-pulse">
    <div className="p-3 lg:p-6 flex flex-col lg:flex-row w-full space-y-2 lg:space-y-0 lg:space-x-4 justify-center">
      <div className="h-10 bg-gray-300 rounded w-1/4"></div>
      <div className="flex-1 flex space-x-2">
        <div className="h-10 bg-gray-300 rounded w-full max-w-xs"></div>
      </div>
      <div className="flex-1 flex space-x-2">
        <div className="h-10 bg-gray-300 rounded w-full max-w-xs"></div>
      </div>
    </div>
    <div className="p-3 lg:p-6">
      <div className="w-full flex flex-col relative space-y-2">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="h-20 bg-gray-300 rounded"></div>
          ))}
      </div>
    </div>
  </div>
)

export default ScheduleComponent
