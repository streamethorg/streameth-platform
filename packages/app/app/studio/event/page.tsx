import * as React from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'

import { Nav } from './components/eventNavigation'
import SettingsNavigation from './components/eventSettings/settingsAccordion'
import {
  fetchEvent,
  fetchEventSession,
  fetchEventSessions,
  fetchEventStages,
} from '@/lib/data'
import Iframe from './components/eventSettings/iframe'
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
            <>
              <div className="w-2/6 min-w-[400px] h-full border-r">
                <SettingsNavigation event={event} />
              </div>
              <div className="w-full h-full">
                <Iframe
                  organizationId={event.organizationId}
                  eventId={event.id}
                />
              </div>
            </>
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
