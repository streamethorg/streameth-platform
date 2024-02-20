'use client'
import { useEffect, useState } from 'react'
import Player from '@/components/ui/Player'
import { buildPlaybackUrl } from '@/lib/utils/utils'

const EmbedPage = () => {
  const [playbackId, setPlaybackId] = useState<string | undefined>(
    undefined
  )
  const [streamId, setStreamId] = useState<string | undefined>(
    undefined
  )
  const [playerName, setPlayerName] = useState<string>('unknown')

  useEffect(() => {
    if (window !== undefined) {
      const params = new URLSearchParams(window.location.search)
      setPlaybackId(params.get('playbackId') ?? undefined)
      setStreamId(params.get('streamId') ?? undefined)
      setPlayerName(params.get('playerName') ?? 'unknown')
    }
  }, [])

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
      <Player
        src={[
          {
            src: buildPlaybackUrl(
              playbackId ?? ''
            ) as `${string}m3u8`,
            width: 1920,
            height: 1080,
            mime: 'application/vnd.apple.mpegurl',
            type: 'hls',
          },
        ]}
      />
    </div>
  )
}

export default EmbedPage
