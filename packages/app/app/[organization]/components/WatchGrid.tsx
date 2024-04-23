import { fetchAllSessions } from '@/lib/data'
import Link from 'next/link'
import VideoCardSkeleton from '@/components/misc/VideoCard/VideoCardSkeleton'
import Videos from '@/components/misc/Videos'
import { Video } from 'lucide-react'

const WatchGrid = async ({
  organizationSlug,
  gridLength = 4,
}: {
  organizationSlug: string
  gridLength?: number
}) => {
  const videos = (
    await fetchAllSessions({
      organizationSlug,
      onlyVideos: true,
      published: true,
      limit: gridLength,
    })
  ).sessions

  return (
    <div className="w-full">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Watch More</h1>
        <Link href={`/${organizationSlug}/videos`}>
          {videos.length !== 0 && (
            <h3 className="text-sm hover:underline">
              See more videos
            </h3>
          )}
        </Link>
      </div>
      <Videos
        videos={videos}
        OrganizationSlug={organizationSlug}
        maxVideos={gridLength}
      />
      {videos.length === 0 && (
        <div className="flex flex-row justify-center items-center p-4 space-x-4 rounded-xl bg-secondary">
          <Video size={20} />
          <p>No videos uploaded</p>
        </div>
      )}
    </div>
  )
}

export const WatchGridLoading = () => (
  <>
    <div className="flex justify-between items-center">
      <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
      <div className="w-1/5 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="grid grid-cols-2 gap-4 m-5 md:grid-cols-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  </>
)

export default WatchGrid
