import StageSelect from './StageSelect'
import DateSelect from './DateSelect'
import ComponentWrapper from '../../components/ComponentWrapper'
import SectionTitle from '../../components/SectionTitle'
import SessionList from '@/components/sessions/SessionList'

import { fetchEventSessions } from '@/lib/data'
import { IStage } from 'streameth-server/model/stage'
import { IEvent } from 'streameth-server/model/event'

const SchedulePageComponent = async ({
  dates,
  stages,
  event,
  stage,
  date,
}: {
  dates: number[]
  stages: IStage[]
  event: IEvent
  stage?: string
  date?: string
}) => {
  const sessions = await fetchEventSessions({
    event: event.id,
    stage: stage,
    date: date ? parseInt(date) : undefined,
  })

  return (
    <ComponentWrapper sectionId="schedule">
      <div className=" flex flex-col md:flex-row w-full rounded-lg z-50 space-y-2 md:space-y-0 md:space-x-2 mb-4 justify-center">
        <SectionTitle title="Schedule" />
        <DateSelect dates={dates} />
        <StageSelect stages={stages} />
      </div>
      <div className="flex flex-row h-full w-full">
        <div className="w-full flex flex-col relative">
          <SessionList event={event} sessions={sessions} />
        </div>
      </div>
    </ComponentWrapper>
  )
}

export default SchedulePageComponent
