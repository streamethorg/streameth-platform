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
import { apiUrl } from '@/lib/utils/utils'
import { generalMetadata, archiveMetadata } from '@/lib/metadata'
import { Metadata } from 'next'

export default async function ArchivePage({
  searchParams,
}: SearchPageProps) {
  const response = await fetch(
    `${apiUrl()}/sessions?organization=${
      searchParams.organization
    }&onlyVideos=true&page=${searchParams.page || 1}&size=12`
  )
  const data = await response.json()
  const videos = data.data.sessions ?? []

  //TODO: remove when total session count is returned from the server
  const responseForCount = await fetch(
    `${apiUrl()}/sessions?organization=${
      searchParams.organization
    }&onlyVideos=true`
  )
  const responseForCountData = await responseForCount.json()
  const totalItems = responseForCountData.data.totalDocuments

  const pagination = {
    totalPages: Math.ceil(totalItems / 12),
    limit: 12,
    totalItems: totalItems,
  }

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
          <Pagination {...pagination} />
        </CardHeader>
        <CardContent>
          <Videos videos={videos} />
        </CardContent>
      </Card>
    </div>
  )
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  if (!searchParams.event) return generalMetadata
  const response = await fetch(
    `${apiUrl()}/events/?${searchParams.event}`
  )
  const responseData = await response.json()
  const event = responseData.data
  if (!event) return generalMetadata
  return archiveMetadata({ event })
}
