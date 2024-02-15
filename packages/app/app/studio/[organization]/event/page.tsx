import * as React from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
import EventSettings from './components/eventSettings'
import StageSettings from './components/stageSettings'
import Navigation from './components/navigation'
import { studioPageParams } from '@/lib/types'

import { fetchEvent } from '@/lib/services/eventService'
import { fetchEventStages } from '@/lib/services/stageService'
import { fetchAllSessions } from '@/lib/data'

export default async function EventPage({
  searchParams,
}: studioPageParams) {
  const event = await fetchEvent({ eventId: searchParams.eventId })
  const stages = await fetchEventStages({
    eventId: searchParams.eventId,
  })

  const sessions = await fetchAllSessions({
    event: searchParams.eventId,
  })

  if (!event) return null

  return (
    <TooltipProvider>
      <div className="flex flex-row h-full overflow-hidden w-full">
        <Navigation event={event} stages={stages} />
        <EventSettings event={event} stages={stages} />
        <StageSettings stages={stages} sessions={sessions.sessions} />
      </div>
    </TooltipProvider>
  )
}
