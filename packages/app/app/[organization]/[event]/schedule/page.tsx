import SchedulePageComponent from './components/ScheduleComponent'
import type { Metadata, ResolvingMetadata } from 'next'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import EventController from 'streameth-server/controller/event'
import { getImageUrl } from '@/lib/utils/utils'
import { fetchEvent, fetchEventStages } from '@/lib/data-back'
import { EventPageProps } from '@/lib/types'

export default async function SchedulePage({
  params,
  searchParams,
}: EventPageProps) {
  const event = await fetchEvent({
    event: params.event,
    organization: params.organization,
  })

  const stages = await fetchEventStages({
    event: params.event,
  })

  return (
    <EmbedLayout>
      <SchedulePageComponent
        stages={stages}
        event={event}
        stage={searchParams.stage}
        date={searchParams.date}
      />
    </EmbedLayout>
  )
}

export async function generateMetadata(
  { params }: EventPageProps,
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
