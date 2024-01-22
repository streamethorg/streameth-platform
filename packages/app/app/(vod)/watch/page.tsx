import Player from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { WatchPageProps } from '@/lib/types'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import RelatedVideos from './components/RelatedVideos'
import ColorComponent from '@/components/Layout/ColorComponent'
import { Metadata } from 'next'
import { apiUrl, getImageUrl } from '@/lib/utils/utils'
import { notFound } from 'next/navigation'
import { generalMetadata, watchMetadata } from '@/lib/metadata'

export default async function Watch({
  searchParams,
}: WatchPageProps) {
  if (!searchParams.session) return notFound()
  const response = await fetch(
    `${apiUrl()}/sessions/${searchParams.session}`
  )
  const data = await response.json()
  const video = data.data

  if (!video) return notFound()

  const tabs = []
  tabs.push({
    value: 'related',
    content: <RelatedVideos event={searchParams.event} />,
  })

  return (
    <ColorComponent accentColor={''}>
      <div className="h-full flex flex-col w-full gap-4 lg:flex-row relative ">
        <div className="flex flex-col w-full h-full z-40 lg:w-[70%] sticky lg:relative lg:top-0  lg:pr-2 ">
          <Player
            assetId={video.assetId}
            playbackId={video.playbackId}
            playerName={video.name}
          />
          <SessionInfoBox
            title={video.name}
            description={video.description}
            playerName={video.name}
            playbackId={video.playbackId}
            speakers={video.speakers}
            assetId={video.assetId}
            viewCount
          />
        </div>
        <Tabs
          defaultValue={tabs[0]?.value ?? ''}
          className="lg:w-[30%] w-full max-h-[100%] lg:ml-2 bg-background p-2 rounded-lg ">
          <TabsList className="w-full bg-background">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.value}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent
              className="h-[calc(100%-50px)] overflow-y-scroll"
              key={tab.value}
              value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ColorComponent>
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
