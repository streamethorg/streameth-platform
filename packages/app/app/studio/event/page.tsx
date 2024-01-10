import * as React from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'

import { Nav } from './components/eventNavigation'
import SettingsNavigation from './components/settingsNavigation'
import { fetchEvent } from '@/lib/data'

export default async function EventPage({
  searchParams,
}: {
  searchParams: {
    eventId: string
  }
}) {
  const event = await fetchEvent({
    event: searchParams.eventId,
  })

  return (
    <TooltipProvider>
      <div className="flex flex-row h-full overflow-hidden w-full">
        <Nav isCollapsed={true} />
        <div className="w-2/6 h-full border-r">
          <SettingsNavigation event={event} />
        </div>
      </div>
    </TooltipProvider>
  )
}
