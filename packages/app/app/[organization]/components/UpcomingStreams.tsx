import { fetchStages } from '@/lib/services/stageService'
import VideoCardMobile from '@/components/misc/VideoCard/VideoCardMobile'
import VideoCardWithMenu from '@/components/misc/VideoCard/VideoCardWithMenu'
import React from 'react'
import VideoCardSkeleton, {
  VideoCardSkeletonMobile,
} from '@/components/misc/VideoCard/VideoCardSkeleton'

const UpcomingStreams = async ({
  organizationId,
}: {
  organizationId: string
}) => {
  const livestreams = await fetchStages({
    organizationId,
  })

  return (
    <>
      <h1 className="text-xl font-bold">Upcoming Streams</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {livestreams.map((livestream) => (
          <React.Fragment key={livestream._id.toString()}>
            <div className="md:hidden">
              <VideoCardMobile session={livestream} link={`/`} />
            </div>
            <div className="hidden md:block">
              <VideoCardWithMenu session={livestream} link={`/`} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}

export default UpcomingStreams

export const UpcomingStreamsLoading = () => (
  <>
    <div className="w-1/4 h-6 bg-gray-300 rounded md:hidden"></div>
    <div className="grid grid-rows-3 gap-4 m-5 md:hidden md:grid-cols-3 md:m-0">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="block md:hidden">
          <VideoCardSkeletonMobile />
        </div>
      ))}
    </div>
  </>
)
