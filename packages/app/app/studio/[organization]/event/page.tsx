import * as React from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import Navigation from './components/navigation'
import { studioPageParams } from '@/lib/types'
import { fetchEvent } from '@/lib/services/eventService'
import { fetchEventStages } from '@/lib/services/stageService'
import { fetchAllSessions } from '@/lib/data'
import StreamConfig from './components/stageSettings/StageConfig'
import EventHomeComponent from '@/app/[organization]/[event]/components/EventHomeComponent'

export default async function EventPage({
  params,
  searchParams,
}: studioPageParams) {
  const {
    settings,
    eventId,
    stage: stageId,
    stageSetting,
  } = searchParams

  const event = await fetchEvent({ eventId: eventId })
  const stages = await fetchEventStages({
    eventId: eventId,
  })
  const sessions = await fetchAllSessions({
    event: eventId,
  })

  if (!event) return null

  const style = {
    '--colors-accent': event.accentColor,
  } as React.CSSProperties
  return (
    <div className="flex flex-row h-full overflow-hidden w-full">
      <TooltipProvider>
        <Navigation
          event={event}
          stages={stages}
          organizationId={params.organization}
        />
      </TooltipProvider>
      {settings !== 'stage' && (
        <div
          className="w-full h-full overflow-auto"
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
      )}
      <div className="w-full h-full">
        <div className="p-2 h-full">
          {settings == 'stage' && <StreamConfig stageId={stageId} />}

          {/* {settings == 'stage' && stageSetting === 'clip' && (
          <Clips
            stage={stage}
            sessions={sessions.filter(
              (session) => session.stageId === stage._id
            )}
          />
        )} */}
        </div>
      </div>
    </div>
  )
}
