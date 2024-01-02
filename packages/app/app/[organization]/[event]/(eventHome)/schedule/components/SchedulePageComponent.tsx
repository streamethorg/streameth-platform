import StageSelect from './StageSelect'
import DateSelect from './DateSelect'
import SessionList from '@/components/sessions/SessionList'

import { fetchEventSessions } from '@/lib/data'
import { IStage } from 'streameth-server/model/stage'
import { IEvent } from 'streameth-server/model/event'
import { getEventDays } from '@/utils/time'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const SchedulePageComponent = async ({
  stages,
  event,
  stage,
  date,
}: {
  stages: IStage[]
  event: IEvent
  stage?: string
  date?: string
}) => {
  const dates = getEventDays(event.start, event.end)

  const sessions = await fetchEventSessions({
    event: event.id,
    stage: stage,
    date: date ? parseInt(date) : undefined,
  })

  return (
    <Card id="schedule" className="border-none">
      <CardHeader className="p-3 md:p-6 flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-4 justify-center">
        <CardTitle className="text-4xl uppercase md:mr-4">
          Schedule
        </CardTitle>
        <DateSelect dates={dates} />
        <StageSelect stages={stages} />
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="w-full flex flex-col relative">
          <SessionList event={event} sessions={sessions} />
        </div>
      </CardContent>
    </Card>
  )
}

export default SchedulePageComponent
