'use client'
import React, { useEffect, useState } from 'react'
import CopyText from '../../../../../../components/misc/CopyText'
import PlayerWithControls from '@/components/ui/Player'
import { IExtendedStage } from '@/lib/types'
import { fetchStage } from '@/lib/services/stageService'

const StreamConfigWithPlayer = ({
  stream,
  streamId,
  organization,
}: {
  stream: IExtendedStage
  streamId: string
  organization: string
}) => {
  const [isLive, setIsLive] = useState(
    stream?.streamSettings?.isActive
  )

  const checkIsLive = async () => {
    try {
      const res = await fetchStage({ stage: stream._id as string })
      setIsLive(res?.streamSettings?.isActive)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (stream?.streamSettings?.isActive) {
      return
    }

    const interval = setInterval(() => {
      checkIsLive()
    }, 5000)
  }, [stream?.streamSettings?.isActive])

  return (
    <>
      {!isLive ? (
        <div className="flex flex-col justify-center items-center p-4 w-full max-w-5xl text-white bg-black rounded-lg aspect-video">
          <h3 className="mb-2 text-3xl font-semibold text-center lg:text-4xl">
            Connect your Streaming providers
          </h3>
          <p className="mb-6 text-lg text-center lg:w-3/4">
            Copy and paste the stream key into your streaming
            software. Use either the RTMP or SRT ingest, depending on
            your use-case. The RTMP ingest is more common with OBS
            users
          </p>
          <div className="flex flex-col gap-3">
            <CopyText
              label="RTMP Ingest"
              text="rtmp://rtmp.livepeer.com/live"
            />
            <CopyText
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
    </>
  )
}

export default StreamConfigWithPlayer
