import SchedulePageComponent from './components/ScheduleComponent'
import type { Metadata, ResolvingMetadata } from 'next'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import { fetchEvent, fetchEventStages } from '@/lib/data'
import { EventPageProps } from '@/lib/types'

export default async function SchedulePage({
  params,
  searchParams,
}: EventPageProps) {
  const event = await fetchEvent({
    event: params.event,
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
  const event = await fetchEvent({
    event: params.event,
  })
  const imageUrl = event.eventCover

  return {
    title: `${event.name} - Home`,
    description: `Attend ${event.name} virtually powered by Streameth here`,
    openGraph: {
      images: [imageUrl!],
    },
  }
}
