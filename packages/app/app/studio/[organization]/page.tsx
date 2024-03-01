import { studioPageParams } from '@/lib/types'
import { fetchEvents } from '@/lib/services/eventService'
import EventList from './components/EventTable'
import LibraryTable from './components/LibraryTable'
import Navigation from './components/Navigation'

const OrganizationPage = async ({
  params,
  searchParams,
}: studioPageParams) => {
  const events = await fetchEvents({
    organizationSlug: params.organization,
  })

  const settings = searchParams?.settings

  return (
    <div className="h-full w-full flex flex-row">
      <Navigation organizationSlug={params.organization} />
      <div className='h-full w-full'>
        {{
          events: (
            <EventList
              organization={params.organization}
              events={events}
            />
          ),
          videos: <LibraryTable organization={params.organization} />,
          settings: <>Nothing here yet</>,
        }[settings] || (
          <EventList
            organization={params.organization}
            events={events}
          />
        )}
      </div>
    </div>
  )
}

export default OrganizationPage
