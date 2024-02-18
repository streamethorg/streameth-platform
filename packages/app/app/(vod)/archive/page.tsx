import { SearchPageProps } from '@/lib/types'
import UpcomingEvents from '@/app/(home)/components/UpcomingEvents'
import UpcomingLoader from '@/app/(home)/components/UpcomingLoader'
import {
  generalMetadata,
  archiveMetadata,
} from '@/lib/utils/metadata'
import { Metadata } from 'next'
import { fetchEvent } from '@/lib/services/eventService'
import { Suspense } from 'react'
import ArchiveVideos from '@/app/(vod)/components/ArchiveVideos'
import ArchiveVideoSkeleton from '../components/ArchiveVideosSkeleton'
export default async function ArchivePage({
  searchParams,
}: SearchPageProps) {
  return (
    <div className="w-full">
      <Suspense fallback={<UpcomingLoader />}>
        <UpcomingEvents
          archive={false}
          organization={
            searchParams.organization
              ? searchParams.organization
              : 'invalid'
          }
        />
      </Suspense>
      <Suspense fallback={<ArchiveVideoSkeleton />}>
        <ArchiveVideos searchParams={searchParams} />
      </Suspense>
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
