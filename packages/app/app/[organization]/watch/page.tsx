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

  if (!video || !video.videoUrl) return notFound()

  return (
    <Suspense key={video._id} fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4 w-full h-full max-w-7xl mx-auto">
        <div className="flex flex-col h-full w-full md:p-4">
          <PlayerWithControls
            src={[
              {
                src: video.videoUrl as `${string}m3u8`,
                width: 1920,
                height: 1080,
                mime: 'application/vnd.apple.mpegurl',
                type: 'hls',
              },
            ]}
          />
          <div className="w-full px-4 md:px-0">
            <SessionInfoBox 
              name={video.name}
              description={video.description ?? ''}
              date={video.createdAt as string}
            vod={true} />
          </div>
        </div>
        <div className="px-4">
          <WatchGrid organizationSlug={params.organization} />
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
