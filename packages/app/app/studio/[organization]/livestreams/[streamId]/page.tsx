import React from 'react'

import Multistream from './components/Multistream'
import LivestreamEmbedCode from './components/LivestreamEmbedCode'
import { fetchStage } from '@/lib/services/stageService'
import { LivestreamPageParams } from '@/lib/types'
import PublishLivestream from './components/PublishLivestream'
import StreamConfigWithPlayer from './components/StreamConfigWithPlayer'
import StreamHeader from './components/StreamHeader'

const Livestream = async ({ params }: LivestreamPageParams) => {
  if (!params.streamId) return null
  const stream = await fetchStage({ stage: params.streamId })

  if (!stream) {
    return <div> no stream data found</div>
  }

  return (
    <div className=" m-auto w-full h-full overflow-y-scroll">
      <div className="flex flex-col max-w-5xl items-center gap-4 p-4 m-auto min-h-full">
        <StreamHeader
          organization={params.organization}
          stream={stream}
          isLiveStreamPage
        />

        <StreamConfigWithPlayer
          stream={stream}
          streamId={params.streamId}
          organization={params.organization}
        />

        <Multistream
          stream={stream}
          organizationId={stream.organizationId as string}
        />

        <LivestreamEmbedCode
          streamId={stream?.streamSettings?.streamId}
          playbackId={stream?.streamSettings?.playbackId}
          playerName={stream?.name}
        />

        <PublishLivestream stream={stream} />
      </div>
    </div>
  )
}

export default Livestream
