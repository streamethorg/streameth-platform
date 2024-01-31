import Videos from '@/components/misc/Videos'
import { SearchPageProps } from '@/lib/types'
import UpcomingEvents from '@/app/(home)/components/UpcomingEvents'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Pagination from '../components/pagination'
import { generalMetadata, archiveMetadata } from '@/lib/metadata'
import { Metadata } from 'next'
import { fetchAllSessions, fetchEvent } from '@/lib/data'
import { Suspense } from 'react'

export default async function ArchivePage({
  searchParams,
}: SearchPageProps) {
  const videos = await fetchAllSessions({
    organizationSlug: searchParams.organization,
    event: searchParams.event,
    limit: 12,
    onlyVideos: true,
    searchQuery: searchParams.searchQuery,
    page: Number(searchParams.page || 1),
  })

  return (
    <Suspense>
      <div className="">
        <UpcomingEvents
          archive={false}
          organization={
            searchParams.organization
              ? searchParams.organization
              : 'invalid'
          }
        />
        <div>
          <div className="flex flex-row items-center justify-between mb-4">
            <CardTitle className=" text-primary">Results</CardTitle>
            <Pagination {...videos.pagination} />
          </div>
          <Videos videos={videos.sessions} />
        </div>
      </div>
    </Suspense>
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
