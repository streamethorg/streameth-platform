import React from 'react'

import StreamInput from './components/StreamInput'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PlayerWithControls from '@/components/ui/Player'

import Multistream from './components/Multistream'
import LivestreamEmbedCodeModal from './components/LivestreamEmbedCodeModal'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchStage } from '@/lib/services/stageService'
import { LivestreamPageParams } from '@/lib/types'
import PublishLivestream from './components/PublishLivestream'

const Livestream = async ({ params }: LivestreamPageParams) => {
  if (!params.streamId) return null
  const stream = await fetchStage({ stage: params.streamId })

  if (!stream) {
    return <div> no stream data found</div>
  }

  return (
    <div className="p-4 flex flex-col gap-5">
      {!stream?.streamSettings?.isActive ? (
        <div className="bg-black text-white p-4 flex flex-col justify-center items-center rounded-lg min-h-[550px]">
          <h3 className="text-3xl lg:text-4xl mb-2 text-center font-semibold">
            Connect your Streaming providers
          </h3>
          <p className="text-lg text-center mb-6 lg:w-3/4">
            Copy and paste the stream key into your streaming
            software. Use either the RTMP or SRT ingest, depending on
            your use-case. The RTMP ingest is more common with OBS
            users
          </p>
          <div className="flex flex-col gap-3">
            <StreamInput
              label="RTMP Ingest"
              text="rtmp://rtmp.livepeer.com/live"
            />
            <StreamInput
              label="Stream key"
              text={stream?.streamSettings?.streamKey}
            />
          </div>
        </div>
      ) : (
        <PlayerWithControls
          src={[
            {
              src: `https://livepeercdn.studio/hls/${stream?.streamSettings?.playbackId}/index.m3u8`,
              width: 1920,
              height: 1080,
              mime: 'application/vnd.apple.mpegurl',
              type: 'hls',
            },
          ]}
        />
      )}

      {!stream?.streamSettings?.isHealthy && (
        <Card>
          <CardContent className="flex justify-between items-center">
            <CardTitle className="text-xl">Stream Health</CardTitle>
            <Link
              href={`/${params.organization}/stream/stage/${params.streamId}`}
              target="_blank">
              <Button variant="outline">
                View Livestream
                <div>
                  <ArrowRight />
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Multistream stream={stream} />

      <Card>
        <CardContent className="flex justify-between items-center">
          <CardTitle className="text-xl">Embed Stream</CardTitle>
          <LivestreamEmbedCodeModal
            streamId={stream?.streamSettings?.streamId}
            playbackId={stream?.streamSettings?.playbackId}
            playerName={stream?.name}
          />
        </CardContent>
      </Card>

      <PublishLivestream stream={stream} />
    </div>
  )
}

export default Livestream
