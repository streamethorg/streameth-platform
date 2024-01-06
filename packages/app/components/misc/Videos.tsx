import Link from 'next/link'
import { ISession } from 'streameth-server/model/session'
import VideoCard from '@/components/misc/VideoCard'
export default async function VideoGrid({
  videos,
  maxVideos,
  scroll,
}: {
  videos: ISession[]
  maxVideos?: number
  scroll?: boolean
}) {
  if (!videos) return null

  return (
    <div className="max-w-screen bg-transparent border-none ">
      <div
        className={`${
          scroll ? 'flex flex-row' : 'grid grid-cols-1'
        }  md:grid md:grid-cols-2 lg:grid-cols-4 gap-4`}>
        {videos.map((video, index) =>
          ({ maxVideos }) && maxVideos && index > maxVideos ? null : (
            <Link
              key={index}
              href={`/watch?event=${video.eventId}&session=${video.id}`}>
              <div
                className={`${
                  scroll && 'w-[300px]'
                } md:w-full h-full border-none bg-white`}>
                <VideoCard session={video} />
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  )
}
