import { IExtendedSession } from '@/lib/types'
import VideoCardWithMenu from './VideoCard/VideoCardWithMenu'
export default async function VideoGrid({
  videos,
  OrganizationSlug,
  maxVideos,
  scroll,
}: {
  videos: IExtendedSession[]
  OrganizationSlug?: string
  maxVideos?: number
  scroll?: boolean
}) {
  if (!videos) return null

  return (
    <div className="bg-transparent border-none lg:w-full max-w-screen">
      <div
        className={`${
          scroll ? 'flex flex-row' : 'grid grid-cols-2'
        }  lg:grid md:grid-cols-3 lg:grid-cols-3 gap-8 gap-x-4`}>
        {videos.map((video, index) =>
          ({ maxVideos }) && maxVideos && index > maxVideos ? null : (
            <div
              key={video._id}
              className={`${
                scroll && 'w-[300px]'
              } lg:w-full h-full border-none flex-initial`}>
              <VideoCardWithMenu
                session={video}
                link={`/${OrganizationSlug}/watch?session=${video._id.toString()}`}
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}
