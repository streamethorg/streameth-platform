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
    <div className="max-w-screen lg:w-full bg-transparent border-none ">
      <div
        className={`${
          scroll ? 'flex flex-row' : 'grid grid-cols-1'
        }  md:grid md:grid-cols-2 lg:grid-cols-4 gap-4`}>
        {videos.map((video, index) =>
          ({ maxVideos }) && maxVideos && index > maxVideos ? null : (
            <div
              key={video.id}
              className={`${
                scroll && 'w-[300px]'
              } md:w-full h-full border-none bg-white flex-initial`}>
              <VideoCard session={video} />
            </div>
          )
        )}
      </div>
    </div>
  )
}
