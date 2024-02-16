import React, { Suspense } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import Navigation from './components/navigation'
import { studioPageParams } from '@/lib/types'
import { fetchEvent } from '@/lib/services/eventService'
import { fetchEventStages } from '@/lib/services/stageService'
import StreamConfig, {
  StreamConfigSkeleton,
} from './components/stageSettings/StageConfig'
import EventHomeComponent from '@/app/[organization]/[event]/components/EventHomeComponent'

export default async function EventPage({
  params,
  searchParams,
}: studioPageParams) {
  const { settings, eventId, stage: stageId } = searchParams

  const event = await fetchEvent({ eventId: eventId })
  const stages = await fetchEventStages({
    eventId: eventId,
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
      {settings === 'event' && (
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
          {settings === 'stage' && (
            <Suspense fallback={<StreamConfigSkeleton />}>
              <StreamConfig stageId={stageId} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  )
}
