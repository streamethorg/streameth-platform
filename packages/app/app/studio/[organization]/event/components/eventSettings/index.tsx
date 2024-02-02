'use client'
import EventHomeComponent from '@/app/[organization]/[event]/components/EventHomeComponent'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { useNavigation } from '../navigation/navigationContext'

const EventSettings = ({
  event,
  stages,
}: {
  event: IEventModel
  stages: IStage[]
}) => {
  const { selectedSetting } = useNavigation()

  const style = {
    '--colors-accent': event.accentColor,
  } as React.CSSProperties

  if (selectedSetting === 'stages') return null
  return (
    <div
      className="w-full h-full overflow-scroll"
      style={{ ...style }}>
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
