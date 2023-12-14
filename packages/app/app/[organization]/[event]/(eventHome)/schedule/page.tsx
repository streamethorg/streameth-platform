import SchedulePageComponent from './components/SchedulePageComponent'
import type { Metadata, ResolvingMetadata } from 'next'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import EventController from 'streameth-server/controller/event'
import { getImageUrl } from '@/utils'
interface Params {
  params: {
    event: string
    organization: string
  }
}
export default function SchedulePage({ params }: Params) {
  return (
    <EmbedLayout>
      <SchedulePageComponent params={params} />
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
