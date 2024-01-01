import SchedulePageComponent from './components/SchedulePageComponent'
import type { Metadata, ResolvingMetadata } from 'next'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import EventController from 'streameth-server/controller/event'
import { getImageUrl } from '@/utils'
import { fetchEvent, fetchEventStages } from '@/lib/data'
import { getEventDays } from '@/utils/time'
interface Params {
  params: {
    event: string
    organization: string
  }
  searchParams: {
    stage?: string
    date?: string
  }
}
export default async function SchedulePage({
  params,
  searchParams,
}: Params) {
  const event = await fetchEvent({
    event: params.event,
    organization: params.organization,
  })

  const stages = await fetchEventStages({
    event: params.event,
  })

  if (!event) return null

  const eventDates = getEventDays(event.start, event.end)

  return (
    <EmbedLayout>
      <SchedulePageComponent
        dates={eventDates}
        stages={stages}
        event={event}
        stage={searchParams.stage}
        date={searchParams.date}
      />
    </EmbedLayout>
  )
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const eventController = new EventController()
  const event = await eventController.getEvent(
    params.event,
    params.organization
  )

  const imageUrl = getImageUrl('/events/' + event.eventCover)

  return {
    title: `${event.name} - Home`,
    description: `Attend ${event.name} virtually powered by Streameth here`,
    openGraph: {
      images: [imageUrl],
    },
  }
}
