import { apiUrl } from '@/server/utils'
import { IEvent } from '@/server/model/event'
import AddEventButton from './components/AddEventButton'
import EventEntry from './components/EventEntry'

export async function generateStaticParams() {
  const data = await (await fetch(`${apiUrl()}/organizations`)).json()

  return data.map((org: { id: string }) => ({
    params: {
      organization: org.id,
    },
  }))
}

const EventPage = async ({ params }: { params: { organization: string } }) => {
  const events: IEvent[] = await (await fetch(`${apiUrl()}/organizations/${params.organization}/events`, {
    cache: 'no-store',
  })).json()

  return (
    <div className="p-4 overflow-scroll">
      <AddEventButton organization={params.organization}  />
      <ul className="space-y-4">
        {events.map((event) => (
          <EventEntry key={event.id} event={event} />
        ))}
      </ul>
    </div>
  )
}

export default EventPage
