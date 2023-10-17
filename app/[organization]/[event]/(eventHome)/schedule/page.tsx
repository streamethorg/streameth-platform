import SchedulePageComponent from './components/SchedulePageComponent'
import EventController from '@/server/controller/event'
import type { Metadata, ResolvingMetadata } from 'next'
interface Params {
  params: {
    event: string
    organization: string
  }
}
export default SchedulePageComponent

export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  const eventController = new EventController()
  const event = await eventController.getEvent(params.event, params.organization)
  const imageName = event.eventCover ? event.eventCover : event.id + '.png'
  const imageUrl = 'https://app.streameth.org/public/' + imageName

  return {
    title: `${event.name} - Home`,
    description: `Attend ${event.name} virtually powered by streameth here`,
    openGraph: {
      images: [imageUrl],
    },
  }
}
