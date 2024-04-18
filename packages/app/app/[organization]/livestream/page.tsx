'use server'

import { PlayerWithControls } from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { OrganizationPageProps } from '@/lib/types'
import { Metadata } from 'next'
import { apiUrl } from '@/lib/utils/utils'
import { notFound } from 'next/navigation'
import { generalMetadata, watchMetadata } from '@/lib/utils/metadata'
import { fetchOrganization } from '@/lib/services/organizationService'
import { Suspense } from 'react'
import WatchGrid from '../components/WatchGrid'
import { fetchStage } from '@/lib/services/stageService'
import Counter from './components/Counter'
import { Livepeer } from 'livepeer'
import { buildPlaybackUrl } from '@/lib/utils/utils'
import ChatBar from '@/components/plugins/Chat'
import { fetchChat } from '@/lib/services/chatService'

export default async function Livestream({
  params,
  searchParams,
}: OrganizationPageProps) {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  }

  if (!searchParams.stage) return notFound()

  const stage = await fetchStage({
    stage: searchParams.stage,
  })
  if (!stage?._id || !stage.streamSettings?.streamId) return notFound()

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const stream = (
    await livepeer.stream.get(stage.streamSettings?.streamId ?? '')
  ).stream

  if (!stream || !stream.playbackId) {
    return notFound()
  }

  const prevChatMessages = await fetchChat({ stageId: stage?._id })

  const timeLeft =
    new Date(stage.streamDate as string).getTime() - Date.now()
  return (
    <Suspense key={stage._id} fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full">
        <div className="flex flex-col w-full h-full md:p-4">
          {timeLeft > 0 ? (
            <Counter timeToStart={timeLeft} />
          ) : (
            <div className='w-full h-full relative'>
              <PlayerWithControls
                src={[
                  {
                    src: buildPlaybackUrl(
                      stream.playbackId
                    ) as `${string}m3u8`,
                    width: 1920,
                    height: 1080,
                    mime: 'application/vnd.apple.mpegurl',
                    type: 'hls',
                  },
                ]}
              />
              <div className='absolute top-0 right-0 h-full w-[400px] flex'>
                <ChatBar stageId={stage._id} prevChatMessages={prevChatMessages} />
              </div>
            </div>
          )}

          <div className=" w-full px-4 md:p-0">
            <SessionInfoBox
              name={stage.name}
              description={stage.description ?? ''}
              date={stage.streamDate as string}
              vod={true}
            />
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
