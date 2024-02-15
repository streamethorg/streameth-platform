'use client'
import EventHomeComponent from '@/app/[organization]/[event]/components/EventHomeComponent'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { IExtendedEvent } from '@/lib/types'
import { useSearchParams } from 'next/navigation'

const EventSettings = ({
  event,
  stages,
}: {
  event: IExtendedEvent
  stages: IStageModel[]
}) => {
  const searchParams = useSearchParams()

  const selectedSetting = searchParams.get('setting')
  const style = {
    '--colors-accent': event.accentColor,
  } as React.CSSProperties

  if (selectedSetting === 'stages') return null
  return (
    <div className="w-full h-full overflow-auto" style={{ ...style }}>
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
