import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import Image from 'next/image'
import FilterBar from '../(home)/components/FilterBar'
import OrganizationController from '@/server/controller/organization'

interface Params {
  organization: string
}

const OrganizationHome = async ({ params }: { params: Params }) => {
  const eventController = new EventController()
  const events = await eventController.getAllEventsForOrganization(
    params.organization
  )

  const organizationController = new OrganizationController()
  const organization = await organizationController.getOrganization(
    params.organization
  )

  return (
    <main className="w-screen mx-auto">
      <div className="sticky top-0 z-[9999] bg-accent flex p-4 gap-4">
        <Image
          src={organization.logo}
          width={50}
          height={50}
          alt={`${organization.name} logo`}
        />
        <FilterBar events={events} />
      </div>
      <div className="flex flex-col p-4 lg:overflow-hidden">
        <EventList events={events} />
      </div>
    </main>
  )
}

export default OrganizationHome
