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
    <div className="bg-white">
      <UpcomingEvents
        archive
        organization={
          searchParams.organization
            ? searchParams.organization
            : 'invalid'
        }
      />
      <Card className="bg-white border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-background">Results</CardTitle>
          <Pagination {...videos.pagination} />
        </CardHeader>
        <CardContent>
          <Videos videos={videos.sessions} />
        </CardContent>
      </Card>
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
