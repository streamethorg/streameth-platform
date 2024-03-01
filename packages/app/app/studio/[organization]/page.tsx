import { studioPageParams } from '@/lib/types'
import { fetchEvents } from '@/lib/services/eventService'
import EventList from './components/EventTable'

const OrganizationPage = async ({ params }: studioPageParams) => {
  const events = await fetchEvents({
    organizationSlug: params.organization,
  })

  return (
    <EventList organization={params.organization} events={events} />
  )
}

export default OrganizationPage
