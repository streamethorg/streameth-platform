export const revalidate = 0
import EventController from 'streameth-server/controller/event'
import OrganizationController from 'streameth-server/controller/organization'
import { IEvent } from 'streameth-server/model/event'
import { apiUrl } from 'streameth-server/utils'
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
    await new OrganizationController().getOrganization(
      params.organization
    )
  const stringifyEvents = JSON.parse(JSON.stringify(events))
  return (
    <>
      <div className="flex flex-row sticky top-0 p-4 shadow bg-white items-center justify-between">
        <h2 className="text-2xl">{organization.name}</h2>
        <AddEventButton organization={params.organization} />
      </div>
      {events.length > 0 ? (
        <div className="w-full p-4">
          <p className="my-2">Your events</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-4">
            {stringifyEvents?.map((event: IEvent) => (
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
