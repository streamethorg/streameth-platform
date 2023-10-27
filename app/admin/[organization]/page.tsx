import { apiUrl } from '@/server/utils'
import { IEvent } from '@/server/model/event'
import AddEventButton from './components/AddEventButton'
import EventEntry from './components/EventEntry'
import AdminItemsContainer from '../components/utils/AdminItemsContainer'
import EventController from '@/server/controller/event'
import OrganizationController from '@/server/controller/organization'
export async function generateStaticParams() {
  const data = await (await fetch(`${apiUrl()}/organizations`)).json()
  return data.map((org: { id: string }) => ({
    params: {
      organization: org.id,
    },
  }))
}

const EventsPage = async ({
  params,
}: {
  params: { organization: string }
}) => {
  let events: IEvent[] = []

  const eventController = new EventController()
  events = await eventController.getAllEvents({
    organizationId: params.organization,
  })
  const organization =
    await new OrganizationController().getOrganization(params.organization)

  return (
    <>
      <div className="flex flex-row sticky top-0 p-4 shadow bg-white items-center justify-between">
        <h2 className="text-2xl">{organization.name}</h2>
        <AddEventButton organization={params.organization} />
      </div>
      {events.length > 0 ? (
        <div className="w-full p-4">
          <p className="my-2">Your events</p>
          <div>
            {events?.map((event) => (
              <EventEntry key={event?.id} event={event} />
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-5">
          There are no events at the moment. To get started, please
          click the &quot;Create a new Event&quot; button.
        </p>
      )}
    </>
  )
}

export default EventsPage
