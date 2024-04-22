import { fetchStages } from '@/lib/services/stageService'
import LivestreamCard from '@/components/misc/VideoCard/LivestreamCard'
import React from 'react'
import { VideoCardSkeletonMobile } from '@/components/misc/VideoCard/VideoCardSkeleton'
import { Podcast } from 'lucide-react'

const UpcomingStreams = async ({
  organizationId,
  organizationSlug,
}: {
  organizationId: string
  organizationSlug: string
}) => {
  let livestreams = await fetchStages({
    organizationId,
  })

  livestreams = livestreams.filter((livestream) => {
    // filter by streams in the future or happening today
    return true
  })

  livestreams = livestreams.filter((livestream) => {
    return livestream.published
  })

  return (
    <>
      <h1 className="text-xl font-bold">Upcoming Streams</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {livestreams.map((livestream) => (
          <React.Fragment key={livestream?._id?.toString()}>
            <div>
              <LivestreamCard
                name={livestream.name}
                date={livestream.streamDate as string}
                thumbnail={''}
                link={`/${organizationSlug}/livestream?stage=${livestream?._id?.toString()}`}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
      {livestreams.length === 0 && (
        <div className="space-x-4 flex flex-row justify-center items-center bg-secondary rounded-xl p-4">
          <Podcast size={20} />
          <p>No scheduled livestreams</p>
        </div>
      )}
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
