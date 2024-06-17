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
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Destinations from './components/Destinations'

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
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col">
            <StreamConfigWithPlayer
              stream={stream}
              streamId={params.streamId}
              organization={params.organization}
            />
            <div className="flex items-center py-2 space-x-2 w-full">
              <span className="mr-auto text-xl font-bold line-clamp-2 lg:max-w-[550px]">
                {stream.name}
              </span>
              <LivestreamEmbedCode
                streamId={stream?.streamSettings?.streamId}
                playbackId={stream?.streamSettings?.playbackId}
                playerName={stream?.name}
              />
              <ShareButton
                url={`/${params.organization}/livestream?stage=${stream._id}`}
                shareFor="livestream"
              />
            </div>
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
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be
                  logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Livestream
