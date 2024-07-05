import {
  ChannelPageParams,
  IExtendedEvent,
  OrganizationPageProps,
} from '@/lib/types'
import { Metadata, ResolvingMetadata } from 'next'
import { fetchEvents } from '@/lib/services/eventService'
import { Suspense } from 'react'
import ArchiveVideos from './components/ArchiveVideos'
import ArchiveVideoSkeleton from '../livestream/components/ArchiveVideosSkeleton'
import Image from 'next/image'
import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'
import EventSelect from './components/eventSelect'
import { fetchAllSessions } from '@/lib/data'
import {
  generalMetadata,
  livestreamMetadata,
  organizationMetadata,
} from '@/lib/utils/metadata'

export default async function ArchivePage({
  params,
  searchParams,
}: OrganizationPageProps) {
  if (!params.organization) {
    return notFound()
  }

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  }

  const events = await fetchEvents({
    organizationId: organization?._id,
  })

  const results = await Promise.all(
    events.map(async (event) => {
      const sessions = (
        await fetchAllSessions({
          event: event._id.toString(),
          onlyVideos: true,
          published: true,
        })
      ).sessions

      return sessions.length > 0 ? event : undefined
    })
  )

  const eventsWithVideos = results.filter(
    (event) => event !== undefined
  )

  return (
    <div className="flex h-full w-full flex-col">
      {organization.banner && (
        <div className="relative hidden aspect-video h-full max-h-[200px] w-full md:block">
          <Image
            src={organization.banner}
            alt="banner"
            quality={100}
            objectFit="cover"
            fill
            priority
          />
        </div>
      )}
      <div className="m-auto h-full w-full max-w-7xl p-4">
        <div className="mb-4 flex w-full flex-row items-center justify-between space-x-2">
          <div className="w-full text-lg font-bold">
            {searchParams.searchQuery
              ? 'Search results'
              : 'All videos'}
          </div>
          <div>
            <EventSelect
              events={eventsWithVideos as IExtendedEvent[]}
            />
          </div>
        </div>
        <Suspense fallback={<ArchiveVideoSkeleton />}>
          <ArchiveVideos
            organizationSlug={params.organization}
            searchQuery={searchParams.searchQuery || ''}
            page={Number(searchParams.page || 1)}
            event={searchParams.event}
          />
        </Suspense>
      </div>
    </div>
  )
}

export async function generateMetadata(
  { params }: ChannelPageParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!params.organization) {
    return generalMetadata
  }

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return generalMetadata
  }

  return organizationMetadata({
    organization,
  })
}
