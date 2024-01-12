'use client'
import { useEffect, useState } from 'react'
import Player from '@/components/ui/Player'

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
        playbackId={playbackId ? playbackId : undefined}
        streamId={streamId ? streamId : undefined}
        playerName={playerName ? playerName : 'unknown'}
      />
    </div>
  )
}

export default EmbedPage
