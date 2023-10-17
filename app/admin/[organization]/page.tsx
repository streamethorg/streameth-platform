import axios from 'axios'
import { apiUrl } from '@/server/utils'
import { IEvent } from '@/server/model/event'
import AddEventButton from './components/AddEventButton'
import EventEntry from './components/EventEntry'
import AdminItemsContainer from '../components/utils/AdminItemsContainer'

export async function generateStaticParams() {
  const data = await (await fetch(`${apiUrl()}/organizations`)).json()
  return data.map((org: { id: string }) => ({
    params: {
      organization: org.id,
    },
  }))
}

const EventsPage = async ({ params }: { params: { organization: string; name: string } }) => {
  try {
    const response = await axios.get(`${apiUrl()}/organizations/${params.organization}/events`)
    const events: IEvent[] = response.data
    return (
      <div className="overflow-auto w-full pt-4">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-2xl">{params.organization}</h2>

          <AddEventButton organization={params.organization} />
        </div>
        <p className="my-2">Your events</p>
        <AdminItemsContainer>{events?.map((event) => <EventEntry key={event?.id} event={event} />)}</AdminItemsContainer>
      </div>
    )
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export default EventsPage
