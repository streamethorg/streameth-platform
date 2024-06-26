'use server'

import React from 'react'
import LivestreamEmbedCode from './components/LivestreamEmbedCode'
import { fetchStage } from '@/lib/services/stageService'
import { LivestreamPageParams } from '@/lib/types'
import StreamConfigWithPlayer from './components/StreamConfigWithPlayer'
import StreamHeader from './components/StreamHeader'
import ShareButton from '@/components/misc/interact/ShareButton'
import NotFound from '@/app/not-found'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Card, CardTitle } from '@/components/ui/card'
import Destinations from './components/Destinations'
import StreamHealth from './components/StreamHealth'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const Livestream = async ({ params }: LivestreamPageParams) => {
  if (!params.streamId) return null
  const stream = await fetchStage({ stage: params.streamId })

  if (!stream) {
    return NotFound()
  }

  return (
    <div className="flex overflow-y-scroll p-4 space-x-4 w-full h-full">
      <div className="w-2/3">
        <StreamHeader
          organization={params.organization}
          stream={stream}
          isLiveStreamPage
        />
        <div className="flex flex-col">
          <StreamConfigWithPlayer
            stream={stream}
            streamId={params.streamId}
            organization={params.organization}
          />
          <div className="flex items-center py-2 space-x-2 w-full">
            <div className="flex flex-grow justify-start items-center space-x-2">
              <span className="text-xl font-bold line-clamp-2 lg:max-w-[550px]">
                {stream.name}
              </span>
              <StreamHealth
                stream={stream}
                streamId={stream?.streamSettings?.streamId || ''}
                organization={params.organization}
                isLive={stream.streamSettings?.isActive}
              />
            </div>

            <LivestreamEmbedCode
              streamId={stream?.streamSettings?.streamId}
              playbackId={stream?.streamSettings?.playbackId}
              playerName={stream?.name}
            />
            <ShareButton
              url={`/${params.organization}/livestream?stage=${stream._id}`}
              shareFor="livestream"
            />
            <Link
              href={`/${params.organization}/livestream?stage=${stream._id}`}
              target="_blank">
              <Button variant="outline">
                View Livestream
                <div>
                  <ArrowRight className="pl-1 w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-1/3 h-full">
        <Tabs defaultValue="destinations">
          <TabsList className="grid grid-cols-2 max-w-2/3">
            <TabsTrigger value="destinations">
              Destinations
            </TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="destinations">
            <Destinations
              stream={stream}
              organization={params.organization}
            />
          </TabsContent>
          <TabsContent value="chat">
            <Card>
              <CardTitle className="p-4">Coming Soon</CardTitle>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Livestream
