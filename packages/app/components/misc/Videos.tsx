import VideoCard from '@/components/misc/VideoCard'
import { IExtendedSession } from '@/lib/types'
export default async function VideoGrid({
  videos,
  maxVideos,
  scroll,
}: {
  videos: IExtendedSession[]
  maxVideos?: number
  scroll?: boolean
}) {
  if (!videos) return null

  return (
    <div className="max-w-screen lg:w-full bg-transparent border-none ">
      <div
        className={`${
          scroll ? 'flex flex-row' : 'grid grid-cols-1'
        }  lg:grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-x-4`}>
        {videos.map((video, index) =>
          ({ maxVideos }) && maxVideos && index > maxVideos ? null : (
            <div
              key={video._id}
              className={`${
                scroll && 'w-[300px]'
              } lg:w-full h-full border-none  flex-initial`}>
              <VideoCard session={video} />
            </div>
          )
        )}
      </div>
    </div>
  )
}
