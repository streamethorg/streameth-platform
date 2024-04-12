import { Card } from '@/components/ui/card'
import { fetchAllSessions } from '@/lib/data'
import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'
import React from 'react'
import { IExtendedSession } from '@/lib/types'
import VideoCardWithMenu from '@/components/misc/VideoCard/VideoCardWithMenu'
import Link from 'next/link'

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

  return (
    <Card className="p-4 space-y-6 bg-white shadow-none">
      <h1 className="text-xl font-bold">Upcoming Streams</h1>
      <div className="grid grid-cols-3 gap-4">
        {livestreams.map((livestream, index) => (
          <Card key={index} className="bg-gray-500 aspect-square">
            {livestream.name}
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Watch More</h1>
        <Link href={`/${organization.slug}/videos`}>
          <h3 className="text-sm hover:underline">See more videos</h3>
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <VideoCardWithMenu
            key={index}
            session={video}
            link={video.videoUrl!}
          />
        ))}
      </div>
    </Card>
  )
}

export default Channel
