import * as React from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'

import { Nav } from './components/eventNavigation'
import {
  fetchEvent,
  fetchEventSessions,
  fetchEventStages,
} from '@/lib/data'
import EventSettings from './components/eventSettings'
import StageSettings from './components/stageSettings'
export default async function EventPage({
  searchParams,
}: {
  searchParams: {
    eventId: string
    settings: string
    stage: string
  }
}) {
  const [event, stages, sessions] = await Promise.all([
    fetchEvent({
      event: searchParams.eventId,
    }),
    fetchEventStages({
      event: searchParams.eventId,
    }),
    fetchEventSessions({
      event: searchParams.eventId,
    }),
  ])

  // get #setting from url
  return (
    <TooltipProvider>
      <div className="flex flex-row h-full overflow-hidden w-full">
        <Nav isCollapsed={true} />
        {!searchParams.settings ||
          (searchParams.settings === 'Home' && (
            <EventSettings event={event} />
          ))}
        {searchParams.settings === 'Livestream' && (
          <StageSettings
            sessions={sessions}
            stages={stages}
            selectedStage={searchParams.stage}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
