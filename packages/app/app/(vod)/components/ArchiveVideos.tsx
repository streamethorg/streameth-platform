import { CardTitle } from '@/components/ui/card'
import Pagination from './pagination'
import { fetchAllSessions } from '@/lib/data'
import Videos from '@/components/misc/Videos'
import { SearchPageProps } from '@/lib/types'
import { FileQuestion } from 'lucide-react'

const ArchiveVideos = async ({ searchParams }: SearchPageProps) => {
  const videos = await fetchAllSessions({
    organizationSlug: searchParams.organization,
    event: searchParams.event,
    limit: 12,
    onlyVideos: true,
    searchQuery: searchParams.searchQuery,
    page: Number(searchParams.page || 1),
  })

  if (videos.pagination.totalItems === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-[25%]">
        <FileQuestion size={65} />
        <span className="bolt text-xl mt-2">
          No videos have been found
        </span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <CardTitle className="px-2 lg:p-0">Results</CardTitle>
        <Pagination {...videos.pagination} />
      </div>
      <Videos videos={videos.sessions} />
    </div>
  )
}

export default ArchiveVideos
