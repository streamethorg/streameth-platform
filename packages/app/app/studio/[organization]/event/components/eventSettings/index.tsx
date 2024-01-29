import SettingsNavigation from './settingsAccordion'
import { fetchEvent, fetchEventStages } from '@/lib/data'
import { EventHomeComponent } from '@/app/[organization]/[event]/page'

const EventSettings = async ({ eventId }: { eventId: string }) => {
  const event = await fetchEvent({ eventId: eventId })
  const stages = await fetchEventStages({ eventId: eventId })
  if (!event) return null

  return (
    <>
      <div className="w-2/6 min-w-[400px] h-full border-r">
        <SettingsNavigation event={event} />
      </div>
      <div className="w-full h-full">
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
    </>
  )
}

export default EventSettings
