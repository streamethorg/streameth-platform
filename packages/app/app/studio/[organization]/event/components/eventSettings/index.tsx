'use client'
import EventHomeComponent from '@/app/[organization]/[event]/components/EventHomeComponent'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { useNavigation } from '../navigation/navigationContext'

const EventSettings = ({
  event,
  stages,
}: {
  event: IEventModel
  stages: IStageModel[]
}) => {
  const { selectedSetting } = useNavigation()

  if (selectedSetting === 'stages') return null
  return null
  return (
    <div className="w-full h-full">
      <EventHomeComponent
        event={event}
        stages={stages}
        params={{
          organization: event.organizationId.toString(),
        }}
        searchParams={{
          stage: undefined,
          date: undefined,
        }}
      />
    </div>
  )
}

export default EventSettings
