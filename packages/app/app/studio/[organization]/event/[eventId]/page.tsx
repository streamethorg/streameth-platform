import React, { Suspense } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
// import Navigation from '../(editor)/components/navigation'
import { studioPageParams } from '@/lib/types'
import { fetchEvent } from '@/lib/services/eventService'
import { fetchEventStages } from '@/lib/services/stageService'
import StreamConfig, {
  StreamConfigSkeleton,
} from './components/stageSettings/StageConfig'
import EventHomeComponent from '@/app/[organization]/[event]/components/EventHomeComponent'
import { notFound } from 'next/navigation'
import Navigation from './components/navigation'

export default async function EventPage({
  params,
  searchParams,
}: studioPageParams) {
  const { settings, eventId, stage: stageId } = searchParams

  const event = await fetchEvent({ eventId: params?.eventId })
  if (!event) return notFound()

  const stages = await fetchEventStages({
    eventId: event.slug,
  })

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
        <div className="w-full h-full overflow-auto">
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
      {settings === 'stage' && (
        <div className="w-full h-full">
          <div className="h-full overflow-auto">
            <Suspense
              key={stageId}
              fallback={<StreamConfigSkeleton />}>
              <StreamConfig stageId={stageId} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  )
}
