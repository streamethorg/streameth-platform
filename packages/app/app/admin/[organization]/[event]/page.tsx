
import CreateEditEvent from '../components/CreateEditEvent'
import { notFound } from 'next/navigation'
import { EventFormProvider } from '../components/EventFormContext'
import { hasData } from '@/utils'
import EventController from '../../../../../server/controller/event'
interface Params {
  event: string
  organization: string
}

const EventPage = async ({ params }: { params: Params }) => {
  const eventController = new EventController()
  const event = await eventController.getEvent(
    params.event,
    params.organization
  )
  if (!hasData({ event })) return notFound()

  return (
    <EventFormProvider
      organizationId={params.organization}
      event={event}>
      <CreateEditEvent />
    </EventFormProvider>
  )
}

export default EventPage
