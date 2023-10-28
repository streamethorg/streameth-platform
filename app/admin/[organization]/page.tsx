export const revalidate = 0
import { apiUrl } from '@/server/utils'
import { IEvent } from '@/server/model/event'
import AddEventButton from './components/AddEventButton'
import EventEntry from './components/EventEntry'
import AdminItemsContainer from '../components/utils/AdminItemsContainer'
import EventController from '@/server/controller/event'

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
  const eventController = new EventController()
  const events = await eventController.getAllEventsForOrganization(
    params.organization
  )
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">{params.organization}</h2>

        <AddEventButton organization={params.organization} />
      </div>
      {events?.length > 0 ? (
        <>
          <p className="my-2">Your events</p>
          <AdminItemsContainer>
            {events?.map((event: IEvent) => (
              <EventEntry key={event?.id} event={event} />
            ))}
          </AdminItemsContainer>
        </>
      ) : (
        <p className="mt-5">
          There are no events at the moment. To get started, please
          click the &quot;Create a new Event&quot; button.
        </p>
      )}
    </div>
  )
}

export default EventsPage
