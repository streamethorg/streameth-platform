import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import Image from 'next/image'
import FilterBar from '../(home)/components/FilterBar'
import OrganizationController from '@/server/controller/organization'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Metadata, ResolvingMetadata } from 'next'
import { getImageUrl } from '@/server/utils'
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
  const getCover = () => {
    if (organization?.id == 'zuzalu') {
      return getImageUrl('/events/zuzalu-cover.png')
    }
    if (organization?.id == 'devconnect') {
      return getImageUrl('/events/devconnect_cover.png')
    }
    return ''
  }

  const beforeStyle = {
    content: '""',
    backgroundImage: `url(${getCover()})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.15,
    zIndex: -1,
  }

  return (
    <main className="w-screen mx-auto fixed overflow-auto h-screen">
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={beforeStyle}></div>
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
        <FilterBar events={events} />
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
