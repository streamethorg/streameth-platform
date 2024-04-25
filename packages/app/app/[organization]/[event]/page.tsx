import { notFound } from 'next/navigation'
import { fetchEvent } from '@/lib/services/eventService'
import { EventPageProps } from '@/lib/types'
import { ResolvingMetadata, Metadata } from 'next'
import { redirect } from 'next/navigation'
import { fetchOrganization } from '@/lib/services/organizationService'
// export async function generateStaticParams() {
//   const allEvents = await fetchEvents({})
//   const paths = allEvents.map((event) => ({
//     organization: event.organizationId,
//     event: event._id,
//   }))
//   return paths
// }

export default async function EventHome({
  params,
  searchParams,
}: EventPageProps) {
  // const event = await fetchEvent({
  //   organization: params.organization,
  //   eventSlug: params.event,
  // })

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  } else {
    redirect(`/${organization.slug}`)
    return 'loading...'
  }

  // if (!event) return notFound()

  // const stages = await fetchEventStages({
  //   eventId: event.slug,
  // })

  // return (
  //   <EventHomeComponent
  //     event={event}
  //     stages={stages}
  //     params={params}
  //     searchParams={searchParams}
  //   />
  // )
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
