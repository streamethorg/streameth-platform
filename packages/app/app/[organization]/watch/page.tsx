import { PlayerWithControls } from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { OrganizationPageProps } from '@/lib/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generalMetadata, watchMetadata } from '@/lib/utils/metadata'
import { fetchSession } from '@/lib/services/sessionService'
import { fetchOrganization } from '@/lib/services/organizationService'
import { Suspense } from 'react'
import WatchGrid from '../components/WatchGrid'
import { getVideoUrlAction } from '@/lib/actions/livepeer'
import { generateThumbnailAction } from '@/lib/actions/sessions'
const Loading = () => {
  return (
    <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full animate-pulse">
      <div className="flex flex-col w-full h-full md:p-4">
        <div className="w-full bg-gray-300 aspect-session"></div>
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
  const session = await fetchSession({
    session: searchParams.session,
  })

  if (!session || (!session.playbackId && !session.assetId))
    return notFound()

  const sessionUrl = await getVideoUrlAction(
    session.assetId,
    session.playbackId
  )
  
  const thumbnail = await generateThumbnailAction(session)

  return (
    <Suspense key={session._id} fallback={<Loading />}>
      <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full">
        <div className="flex flex-col w-full h-full md:p-4">
          <PlayerWithControls
            name={session.name}
            thumbnail={session.coverImage ?? thumbnail}
            src={[
              {
                src: sessionUrl as `${string}m3u8`,
                width: 1920,
                height: 1080,
                mime: 'application/vnd.apple.mpegurl',
                type: 'hls',
              },
            ]}
          />
          <div className="px-4 w-full md:px-0">
            <SessionInfoBox
              name={session.name}
              description={session.description ?? 'No description'}
              speakers={session.speakers}
              date={session.createdAt as string}
              playbackId={session.playbackId}
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
  params,
  searchParams,
}: OrganizationPageProps): Promise<Metadata> {
  if (!searchParams.session) return generalMetadata

  const session = await fetchSession({
    session: searchParams.session,
  })
  const organization = await fetchOrganization({
    organizationSlug: params?.organization,
  })

  if (!session || !organization) return generalMetadata
  return watchMetadata({ organization, session: session })
}
