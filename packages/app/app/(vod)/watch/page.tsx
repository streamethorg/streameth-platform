import { PlayerWithControls } from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { WatchPageProps } from '@/lib/types'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import RelatedVideos from './components/RelatedVideos'
import { Metadata } from 'next'
import { apiUrl } from '@/lib/utils/utils'
import { notFound } from 'next/navigation'
import { generalMetadata, watchMetadata } from '@/lib/utils/metadata'
import { fetchSession } from '@/lib/services/sessionService'
import { Suspense } from 'react'

export default async function Watch({
  searchParams,
}: WatchPageProps) {
  if (!searchParams.session) return notFound()
  const video = await fetchSession({
    session: searchParams.session,
  })
  if (!video || !video.videoUrl) return notFound()

  const tabs = []
  tabs.push({
    value: 'Related videos',
    content: <RelatedVideos searchQuery={video.name} />,
  })

  return (
    <Suspense key={video._id} fallback={<div>Loading...</div>}>
      <div className="h-full flex flex-col w-full gap-4 lg:flex-row relative">
        <div className="flex flex-col w-full h-full lg:w-[75%] gap-2 ">
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
          <SessionInfoBox
            title={video.name}
            description={video.description}
            playerName={video.name}
            playbackId={video.playbackId}
            speakers={video.speakers}
            assetId={video.assetId}
            vod={true}
            viewCount
          />
        </div>
        <Tabs
          defaultValue={tabs[0]?.value ?? ''}
          className="lg:w-[25%] w-full max-h-[100%] ">
          <TabsList className="w-full bg-secondary">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.value}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent
              className="h-[calc(100%-50px)] w-full"
              key={tab.value}
              value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Suspense>
  )
}

export async function generateMetadata({
  searchParams,
}: WatchPageProps): Promise<Metadata> {
  const response = await fetch(
    `${apiUrl()}/sessions/${searchParams.session}`
  )
  const responseData = await response.json()
  const video = responseData.data

  if (!searchParams.session) return generalMetadata

  if (!video) return generalMetadata
  return watchMetadata({ session: video })
}
