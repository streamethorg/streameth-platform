'use client'

import { Player as LivepeerPlayer, useStream } from '@livepeer/react'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'
// @ts-ignore
import mux from 'mux-embed'
import Image from 'next/image'
import Logo from '@/public/logo.png'

const OfflinePlayer = () => {
  return (
    <div className="min-h-[300px] md:min-h-[500px] md:aspect-video bg-black flex items-center justify-center flex-col h-full">
      <div className="flex flex-col items-center justify-center space-y-2 transform -translate-y-6">
        <span className="text-2xl font-bold text-white text-center">Stream is offline</span>
        <span className="text-white dark:text-gray-300 text-xs hidden md:block text-center">Powered by</span>
        <a className="relative w-24 lg:w-32 h-6" href="https://streameth.org" target="_blank" rel="noreferrer">
          <Image src={Logo} width={200} height={200} alt="streamETH" />
        </a>
      </div>
    </div>
  )
}

export const Player = ({
  playbackId,
  streamId,
  playerName,
  coverImage,
}: {
  playbackId?: string
  streamId?: string
  playerName: string
  coverImage?: string
}) => {
  const { address } = useAccount()
  const { data: stream } = useStream({
    streamId,
    refetchInterval: (s) => (s?.isActive ? false : 5000),
  })
  console.log(stream)

  const mediaElementRef = useCallback(
    (ref: HTMLMediaElement) => {
      if (ref && process.env.NEXT_PUBLIC_MUX_ENV_KEY) {
        const initTime = mux.utils.now()
        mux.monitor(ref, {
          debug: false,
          data: {
            env_key: process.env.NEXT_PUBLIC_MUX_ENV_KEY,
            player_name: playerName ?? 'livepeer player',
            player_init_time: initTime,
          },
        })
      }
    },
    [playerName]
  )

  // if (!playbackId && !stream?.isActive) return <OfflinePlayer />

  return (
    <div className="relative w-full aspect-video h-full">
      <LivepeerPlayer
        mediaElementRef={mediaElementRef}
        playbackId={playbackId ?? stream?.playbackId}
        showTitle={false}
        showPipButton={false}
        showLoadingSpinner={true}
        autoPlay
        controls={{ autohide: 0, hotkeys: false, defaultVolume: 0.6 }}
        viewerId={address}
      />
    </div>
  )
}

export default Player
