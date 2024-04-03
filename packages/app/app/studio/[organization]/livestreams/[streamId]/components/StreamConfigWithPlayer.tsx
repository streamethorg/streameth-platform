import React from 'react'
import StreamInput from './StreamInput'
import PlayerWithControls from '@/components/ui/Player'
import { IExtendedStage } from '@/lib/types'

const StreamConfigWithPlayer = ({
  stream,
}: {
  stream: IExtendedStage
}) => {
  return !stream?.streamSettings?.isActive ? (
    <div className="bg-black text-white p-4 flex flex-col justify-center items-center w-full rounded-lg aspect-video max-w-5xl">
      <h3 className="text-3xl lg:text-4xl mb-2 text-center font-semibold">
        Connect your Streaming providers
      </h3>
      <p className="text-lg text-center mb-6 lg:w-3/4">
        Copy and paste the stream key into your streaming software.
        Use either the RTMP or SRT ingest, depending on your use-case.
        The RTMP ingest is more common with OBS users
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
  )
}

export default StreamConfigWithPlayer
