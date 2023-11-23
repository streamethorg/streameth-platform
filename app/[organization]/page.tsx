import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import Image from 'next/image'
import FilterBar from '../(home)/components/FilterBar'
import OrganizationController from '@/server/controller/organization'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Metadata, ResolvingMetadata } from 'next'
import { getImageUrl } from '@/server/utils'
import ColorComponent from '../utils/ColorComponent'
import { notFound } from 'next/navigation'
import { IOrganization } from '@/server/model/organization'

interface Params {
  params: {
    organization: string
  }
}

export default async function OrganizationHome({ params }: Params) {
  if (!params.organization) {
    return notFound()
  }

  const events =
    await new EventController().getAllEventsForOrganization(
      params.organization
    )

  const organization =
    await new OrganizationController().getOrganization(
      params.organization
    )

  return (
    <main className="w-screen mx-auto fixed overflow-auto h-screen">
      <div className="sticky bg-white top-0 z-50 flex p-4 px-9 gap-4">
        <Image
          src={getImageUrl(organization.logo)}
          width={50}
          height={50}
          style={{
            objectFit: 'cover',
          }}
          alt={`${organization.name} logo`}
        />
        {/* <FilterBar events={events.map((event) => event.toJson())} /> */}
      </div>
      <div className="bg-base rounded-xl mx-9 my-3">
        <p className="flex justify-center pt-4 text-accent font-bold text-4xl">
          {organization.name}
        </p>
        <article className="prose max-w-full text-center prose-invert p-4">
          <Markdown remarkPlugins={[remarkGfm]}>
            {organization.description}
          </Markdown>
        </article>
      </div>
      <hr className="h-px mx-9  bg-base" />
      <div className="overflow-auto h-screen">
        <div className="px-4">
          <EventList events={events.map((event) => event.toJson())} />
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
