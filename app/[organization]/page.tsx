import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import Image from 'next/image'
import FilterBar from '../(home)/components/FilterBar'
import OrganizationController from '@/server/controller/organization'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
      <div className="sticky top-0 z-50 bg-accent flex p-4 gap-4">
        <Image
          src={organization.logo}
          width={50}
          height={50}
          alt={`${organization.name} logo`}
        />
        <FilterBar events={events} />
      </div>
      <div className="bg-base mx-9 my-3">
        <p className="flex justify-center pt-4 text-white font-bold text-4xl">
          {organization.name}
        </p>
        <article className="prose prose-invert p-4">
          <Markdown remarkPlugins={[remarkGfm]}>
            {organization.description}
          </Markdown>
        </article>
      </div>
      <hr className="h-px mx-9 border-0 bg-base" />
      <div className="px-4">
        <EventList events={events} />
      </div>
    </main>
  )
}

export default OrganizationHome
