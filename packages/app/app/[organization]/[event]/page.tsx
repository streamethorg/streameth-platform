import { notFound } from 'next/navigation'
import { fetchEvent, fetchEventStages, fetchEvents } from '@/lib/data'
import { EventPageProps } from '@/lib/types'
import { ResolvingMetadata, Metadata } from 'next'
import EventHomeComponent from './components/EventHomeComponent'
export async function generateStaticParams() {
  const allEvents = await fetchEvents({})
  const paths = allEvents.map((event) => ({
    organization: event.organizationId,
    event: event._id,
  }))
  return paths
}

export default async function EventHome({
  params,
  searchParams,
}: EventPageProps) {
  const event = await fetchEvent({
    eventSlug: params.event,
  })

  if (!event) return notFound()

  const stages = await fetchEventStages({
    eventId: event.slug,
  })

  return (
    <EventHomeComponent
      event={event}
      stages={stages}
      params={params}
      searchParams={searchParams}
    />
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
    return {
      title: 'StreamETH Event',
    }
  }

  const imageUrl = eventInfo.eventCover
  try {
    return {
      title: eventInfo.name,
      description: eventInfo.description,
      openGraph: {
        title: eventInfo.name,
        description: eventInfo.description,
        images: [imageUrl!],
      },
      twitter: {
        card: 'summary_large_image',
        title: eventInfo.name,
        description: eventInfo.description,
        images: {
          url: imageUrl!,
          alt: eventInfo.name + ' Logo',
        },
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: 'StreamETH Event',
    }
  }
}
