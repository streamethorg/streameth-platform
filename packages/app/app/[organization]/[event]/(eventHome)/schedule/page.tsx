import SchedulePageComponent from './components/SchedulePageComponent'
import type { Metadata, ResolvingMetadata } from 'next'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import EventController from 'streameth-server/controller/event'
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
  const imageName = event.eventCover
    ? event.eventCover
    : event.id + '.png'
  const imageUrl = 'https://app.streameth.org/public/' + imageName

  return {
    title: `${event.name} - Home`,
    description: `Attend ${event.name} virtually powered by Streameth here`,
    openGraph: {
      images: [imageUrl],
    },
  }
}
