import * as React from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
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
  // const linksData: link[] = [
  //   {
  //     title: 'Home',
  //     icon: Inbox,
  //     variant: 'default',
  //   },
  //   {
  //     title: 'Livestream',
  //     icon: File,
  //     variant: 'ghost',
  //   },
  // ]

  // get #setting from url
  return (
    <TooltipProvider>
      <div className="flex flex-row h-full overflow-hidden w-full">
        {/* <Nav isCollapsed={true} /> */}
        {!searchParams.settings ||
          (searchParams.settings === 'Home' && (
            <EventSettings eventId={searchParams.eventId} />
          ))}
        {searchParams.settings === 'Livestream' && (
          <StageSettings
            eventId={searchParams.eventId}
            selectedStage={searchParams.stage}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
