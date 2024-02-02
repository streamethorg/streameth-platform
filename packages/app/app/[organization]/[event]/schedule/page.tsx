import SchedulePageComponent from './components/ScheduleComponent'
import type { Metadata, ResolvingMetadata } from 'next'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import { fetchEvent } from '@/lib/services/eventService'
import { EventPageProps } from '@/lib/types'
import {
  archiveMetadata,
  generalMetadata,
} from '@/lib/utils/metadata'

import { fetchEventStages } from '@/lib/services/stageService'

export default async function SchedulePage({
  params,
  searchParams,
}: EventPageProps) {
  const event = await fetchEvent({
    eventSlug: params.event,
  })

  if (!event) {
    return null
  }
  const stages = await fetchEventStages({
    eventId: params.event,
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
  const { event } = params
  const eventInfo = await fetchEvent({
    eventSlug: event,
  })

  if (!eventInfo) {
    return generalMetadata
  }

  return archiveMetadata({
    event: eventInfo,
  })
}
