import * as React from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'

import { Nav } from './components/eventNavigation'
import SettingsNavigation from './components/eventSettings/settingsAccordion'
import StageAccordion from './components/stageSettings/stageAccordion'
import StageSettings from './components/stageSettings/stageSettings'
import { fetchEvent, fetchEventStages } from '@/lib/data'
import Iframe from './components/eventSettings/iframe'

export default async function EventPage({
  searchParams,
}: {
  searchParams: {
    eventId: string
    settings: string
    stage: string
  }
}) {
  const [event, stages] = await Promise.all([
    fetchEvent({
      event: searchParams.eventId,
    }),
    fetchEventStages({
      event: searchParams.eventId,
    }),
  ])

  const [stage] = stages.filter(
    (stage) => stage.id === searchParams.stage
  )

  // get #setting from url
  return (
    <TooltipProvider>
      <div className="flex flex-row h-full overflow-hidden w-full">
        <Nav isCollapsed={true} />
        {!searchParams.settings && (
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
        )}
        {searchParams.settings === 'Livestream' && (
          <>
            <div className="w-2/6 min-w-[400px] h-full border-r">
              <StageAccordion stages={stages} />
            </div>
            <div className="w-full h-full">
              {stage && <StageSettings stage={stage} />}
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
