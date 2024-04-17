import { fetchAllSessions } from '@/lib/data'
import Link from 'next/link'
import VideoCardWithMenu from '@/components/misc/VideoCard/VideoCardWithMenu'
import VideoCardSkeleton, {
} from '@/components/misc/VideoCard/VideoCardSkeleton'

const WatchGrid = async ({
  organizationSlug,
}: {
  organizationSlug: string
}) => {
  const videos = (
    await fetchAllSessions({
      organizationSlug,
      onlyVideos: true,
      limit: 4,
    })
  ).sessions

  if (videos.length === 0) {
    return null
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Watch More</h1>
        <Link href={`/${organizationSlug}/videos`}>
          <h3 className="text-sm hover:underline">See more videos</h3>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {videos.slice(0, 4).map((video) => (
          <VideoCardWithMenu
            key={video._id.toString()}
            showDate={false}
            session={video}
            link={`/${organizationSlug}/watch?session=${video._id.toString()}`}
          />
        ))}
      </div>
    </>
  )
}

export default WatchGrid

export const WatchGrdiLoading = () => (
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
