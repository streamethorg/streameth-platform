"use client"

import Player from '@/components/misc/Player'

const EmbedPage = () => {
  const params = new URLSearchParams(window.location.search)
  const playbackId = params.get('playbackId')
  const streamId = params.get('streamId')
  const playerName = params.get('playerName')

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
