import EventController from '@/server/controller/event'
import { notFound } from 'next/navigation'
import ColorComponent from '../utils/ColorComponent'
import OrganizationController from '@/server/controller/organization'

export async function generateStaticParams() {
  const eventController = new EventController()
  const allEvents = await eventController.getAllEvents({})
  const paths = allEvents.map((event) => ({
    organization: event.organizationId,
    event: event.id,
  }))
  return paths
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    organization: string
    event: string
  }
}) => {
  const organizationController = new OrganizationController()
  const organization = await organizationController.getOrganization(
    params.organization
  )
  if (!organization) {
    return notFound()
  }

  return (
    <div className="h-full flex flex-col z-1 min-h-screen">
      <main className="flex w-full ml-auto md:h-full flex-grow">
        <ColorComponent organization={organization}>
          {children}
        </ColorComponent>
      </main>
    </div>
  )
}

export default Layout
