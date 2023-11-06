import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import Image from 'next/image'
import FilterBar from '../(home)/components/FilterBar'
import OrganizationController from '@/server/controller/organization'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Metadata, ResolvingMetadata } from 'next'

interface Params {
  params: {
    organization: string
  }
}

export default async function OrganizationHome({ params }: Params) {
  const eventController = new EventController()
  const events = await eventController.getAllEventsForOrganization(
    params.organization
  )

  const organizationController = new OrganizationController()
  const organization = await organizationController.getOrganization(
    params.organization
  )

  return (
    <main className="w-screen mx-auto fixed overflow-auto h-screen">
      <div className="sticky top-0 z-50 bg-accent pb-2">
        <div className="flex p-4 px-8 gap-4 cursor-pointer">
          <Image
            src={organization.logo}
            width={50}
            height={50}
            objectFit="cover"
            alt={`${organization.name} logo`}
          />
          <FilterBar events={events} />
        </div>
        <div className="bg-base rounded-xl mx-8 my-3">
          <p className="flex justify-center pt-4 text-white font-bold text-4xl">
            {organization.name}
          </p>
          <article className="prose max-w-full text-center prose-invert p-4">
            <Markdown remarkPlugins={[remarkGfm]}>
              {organization.description}
            </Markdown>
          </article>
        </div>
      </div>
      <div className="overflow-auto pb-16">
        <div className="px-4">
          <EventList events={events} />
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const organizationController = new OrganizationController()
  const organizationInfo =
    await organizationController.getOrganization(params.organization)

  const imageUrl = organizationInfo.logo
  try {
    return {
      title: organizationInfo.name,
      description: organizationInfo.description,
      openGraph: {
        images: [imageUrl],
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: organizationInfo.name,
      description: organizationInfo.description,
    }
  }
}
