import { CardTitle } from '@/components/ui/card'
import Pagination from './pagination'
import { fetchAllSessions } from '@/lib/data'
import Videos from '@/components/misc/Videos'
import { SearchPageProps } from '@/lib/types'

const ArchiveVideos = async ({ searchParams }: SearchPageProps) => {
  const videos = await fetchAllSessions({
    organizationSlug: searchParams.organization,
    event: searchParams.event,
    limit: 12,
    onlyVideos: true,
    searchQuery: searchParams.searchQuery,
    page: Number(searchParams.page || 1),
  })

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <CardTitle className="">Results</CardTitle>
        <Pagination {...videos.pagination} />
      </div>
      <Videos videos={videos.sessions} />
    </div>
  )
}

export default ArchiveVideos
