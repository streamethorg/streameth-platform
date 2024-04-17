import { Card } from '@/components/ui/card'
import { fetchAllSessions } from '@/lib/data'
import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'
import React from 'react'
import { IExtendedSession } from '@/lib/types'
import VideoCardWithMenu from '@/components/misc/VideoCard/VideoCardWithMenu'
import Link from 'next/link'
import { Video } from 'lucide-react'
import { VideoCardSkeletonMobile } from '@/components/misc/VideoCard/VideoCardSkeleton'
import VideoCardMobile from '@/components/misc/VideoCard/VideoCardMobile'

const Channel = async ({
  organizationSlug,
  playerActive,
  tab,
  searchVideos,
  searchQuery,
}: {
  organizationSlug: string
  playerActive?: boolean
  searchVideos: IExtendedSession[]
  tab?: string
  searchQuery?: string
}) => {
  const organization = await fetchOrganization({ organizationSlug })
  if (!organization) return notFound()

  const AllVideos = (
    await fetchAllSessions({
      organizationSlug: organizationSlug,
      onlyVideos: true,
    })
  ).sessions

  const livestreams = AllVideos.filter(
    (video) => video.type === 'livestream'
  )
  const videos = AllVideos.filter(
    (video) => video.type === 'clip' || video.type === 'video'
  )

  if (videos.length === 0 && livestreams.length === 0) {
    return (
      <Card className="flex flex-col justify-center items-center p-4 bg-white shadow-none min-h-[550px] md:min-h-[450px]">
        <Video size={130} />
        <p>No videos or livestreams uploaded yet</p>
      </Card>
    )
  }

  return (
    <Card className="p-4 pt-40 space-y-6 bg-white shadow-none md:pt-4">
      {livestreams.length !== 0 && (
        <>
          <h1 className="text-xl font-bold">Upcoming Streams</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {livestreams.map((livestream) => (
              <React.Fragment key={livestream._id.toString()}>
                <div className="md:hidden">
                  <VideoCardMobile session={videos[0]} link={`/`} />
                </div>
                <div className="hidden md:block">
                  <VideoCardWithMenu session={videos[0]} link={`/`} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Watch More</h1>
        <Link href={`/${organization.slug}/videos`}>
          <h3 className="text-sm hover:underline">See more videos</h3>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {videos.slice(0, 4).map((video) => (
          <VideoCardWithMenu
            key={video._id.toString()}
            showDate={false}
            session={video}
            link={`/watch?session=${video._id.toString()}`}
          />
        ))}
      </div>
    </Card>
  )
}

export default Channel
