import { PlayerWithControls } from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { OrganizationPageProps } from '@/lib/types'
import { Metadata } from 'next'
import { apiUrl } from '@/lib/utils/utils'
import { notFound } from 'next/navigation'
import { generalMetadata, watchMetadata } from '@/lib/utils/metadata'
import { fetchSession } from '@/lib/services/sessionService'
import { fetchOrganization } from '@/lib/services/organizationService'
import { Suspense } from 'react'
import WatchGrid from '../components/WatchGrid'
import { getVideoUrlAction } from '@/lib/actions/livepeer'
const Loading = () => {
  return (
    <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full animate-pulse">
      <div className="flex flex-col w-full h-full md:p-4">
        <div className="w-full bg-gray-300 aspect-video"></div>
        <div className="px-4 mt-4 space-y-2 w-full md:px-0">
          <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
          <div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
          <div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
          <div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
        </div>
      </div>
    </div>
  )
}

export default async function Watch({
  params,
  searchParams,
}: OrganizationPageProps) {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  }

  if (!searchParams.session) return notFound()
  const video = await fetchSession({
    session: searchParams.session,
  })

  const videoUrl = await getVideoUrlAction(
    video?.assetId,
    video?.playbackId
  )
  if (!video || !videoUrl) return notFound()

  return (
    <Suspense key={video._id} fallback={<Loading />}>
      <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full">
        <div className="flex flex-col w-full h-full md:p-4">
          <PlayerWithControls
            src={[
              {
                src: videoUrl as `${string}m3u8`,
                width: 1920,
                height: 1080,
                mime: 'application/vnd.apple.mpegurl',
                type: 'hls',
              },
            ]}
          />
          <div className="px-4 w-full md:px-0">
            <SessionInfoBox
              name={video.name}
              description={video.description ?? 'No description'}
              speakers={video.speakers}
              date={video.createdAt as string}
              playbackId={video.playbackId}
              video={video}
              organizationSlug={params.organization}
              vod={true}
            />
          </div>
        </div>
        <div className="px-4">
          <div className="md:hidden">
            <WatchGrid organizationSlug={params.organization} />
          </div>
          <div className="hidden md:block">
            <WatchGrid
              organizationSlug={params.organization}
              gridLength={6}
            />
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export async function generateMetadata({
  searchParams,
}: OrganizationPageProps): Promise<Metadata> {
  const response = await fetch(
    `${apiUrl()}/sessions/${searchParams.session}`
  )
  const responseData = await response.json()
  const video = responseData.data

  if (!searchParams.session) return generalMetadata

  if (!video) return generalMetadata
  return watchMetadata({ session: video })
}
