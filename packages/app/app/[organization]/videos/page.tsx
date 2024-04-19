import { OrganizationPageProps, SearchPageProps } from '@/lib/types'
import {
  generalMetadata,
  archiveMetadata,
} from '@/lib/utils/metadata'
import { Metadata } from 'next'
import { fetchEvent } from '@/lib/services/eventService'
import { Suspense } from 'react'
import ArchiveVideos from '@/app/(vod)/components/ArchiveVideos'
import ArchiveVideoSkeleton from '@/app/(vod)/components/ArchiveVideosSkeleton'

import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'

import ChannelBanner from '../components/ChannelBanner'

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

  return (
    <div>
      <ChannelBanner organization={organization} />
      <div className="w-full max-w-7xl m-auto p-4">
        <Suspense fallback={<ArchiveVideoSkeleton />}>
          <ArchiveVideos
            organizationSlug={params.organization}
            searchQuery={searchParams.searchQuery || ''}
            page={Number(searchParams.page || 1)}
          />
        </Suspense>
      </div>
    </div>
  )
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  if (!searchParams.event) return generalMetadata
  const event = await fetchEvent({
    eventSlug: searchParams.event,
  })

  if (!event) return generalMetadata
  return archiveMetadata({ event })
}
