import { fetchAllSessions } from '@/lib/data'
import Videos from '@/components/misc/Videos'
import { FileQuestion } from 'lucide-react'
import Pagination from './pagination'

const ArchiveVideos = async ({
  organizationSlug,
  event,
  searchQuery,
  page,
}: {
  organizationSlug?: string
  event?: string
  searchQuery?: string
  page?: number
}) => {
  const videos = await fetchAllSessions({
    organizationSlug,
    event: event,
    limit: 12,
    onlyVideos: true,
    searchQuery,
    page: Number(page || 1),
  })

  if (videos.pagination.totalItems === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-[25%]">
        <FileQuestion size={65} />
        <span className="mt-2 text-xl bolt">
          No videos have been found
        </span>
      </div>
    )
  }

  return (
    <>
      <Videos
        OrganizationSlug={organizationSlug}
        videos={videos.sessions}
      />
      <Pagination {...videos.pagination} />
    </>
  )
}

export default ArchiveVideos
