import Image from 'next/image'
import FilterBar from '../(home)/components/FilterBar'
import remarkGfm from 'remark-gfm'
import ColorComponent from '../utils/ColorComponent'
import { notFound } from 'next/navigation'
import EventController from 'streameth-server/controller/event'
import OrganizationController from 'streameth-server/controller/organization'
import { getImageUrl } from '@/utils'
import EventList from '../(home)/components/EventList'
import Markdown from 'react-markdown'
import { Metadata, ResolvingMetadata } from 'next'
import UpcomingEvents from '../(home)/components/UpcomingEvents'

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

  const pastEvents = events
    .filter((event) => {
      const endDate = new Date(event?.end)
      endDate.setUTCHours(0, 0, 0, 0)
      return endDate.getTime() < new Date().getTime()
    })
    .map((event) => event.toJson())
  const upComing = events
    .filter((event) => {
      const startDate = new Date(event?.end)
      startDate.setUTCHours(0, 0, 0, 0)
      return startDate.getTime() > new Date().getTime()
    })
    .map((event) => event.toJson())
    .sort(
      (a, b) =>
        new Date(a.start).getTime() - new Date(b.start).getTime()
    )

  const organization =
    await new OrganizationController().getOrganization(
      params.organization
    )

  return (
    <main className="w-screen mx-auto fixed overflow-auto h-screen">
      <div className="sticky bg-white top-0 z-50 flex p-4 px-9 gap-4">
        <Image
          src={organization.logo}
          width={50}
          height={50}
          style={{
            objectFit: 'cover',
          }}
          alt={`${organization.name} logo`}
        />
        {/* <FilterBar events={events.map((event) => event.toJson())} /> */}
      </div>
      <div
        className="mx-8 rounded-xl"
        style={{
          backgroundColor: organization.accentColor
            ? organization.accentColor
            : '#fff',
        }}>
        <div className="bg-base py-4 rounded-xl my-3">
          <p className="flex justify-center pt-4 text-accent font-bold text-4xl">
            {organization.name}
          </p>
          <article className="prose max-w-full text-center prose-invert p-4">
            <Markdown remarkPlugins={[remarkGfm]}>
              {organization.description}
            </Markdown>
          </article>
        </div>
      </div>
      <hr className="h-px mx-9  bg-base" />
      <div className="overflow-auto h-screen">
        <div className="px-4">
          {upComing.length > 0 && (
            <>
              <p className="px-4 mt-3 font-ubuntu font-bold md:py-2 text-blue text-2xl md:text-4xl">
                Upcoming Events
              </p>
              <UpcomingEvents events={upComing} />
            </>
          )}
          <EventList events={pastEvents.map((event) => event)} />
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
