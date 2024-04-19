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
  let videos = (
    await fetchAllSessions({
      organizationSlug,
      onlyVideos: true,
      limit: gridLength,
    })
  ).sessions

  videos = videos.filter((video) => video.published)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Watch More</h1>
        <Link href={`/${organizationSlug}/videos`}>
          <h3 className="text-sm hover:underline">See more videos</h3>
        </Link>
      </div>
      <Videos
        videos={videos}
        OrganizationSlug={organizationSlug}
        maxVideos={gridLength}
      />
      {videos.length === 0 && (
        <div className="flex flex-col justify-center items-center space-y-2">
          <Video size={80} />
          <p>No videos available</p>
        </div>
      )}
    </div>
  )
}

export default WatchGrid

export const WatchGridLoading = () => (
  <>
    <div className="flex justify-between items-center">
      <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
      <div className="w-1/5 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="grid grid-cols-2 gap-4 m-5 md:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  </>
)
