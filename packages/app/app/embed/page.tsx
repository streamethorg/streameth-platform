// 'use client'
import Player from '@/components/ui/Player'
import { buildPlaybackUrl } from '@/lib/utils/utils'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { fetchSession } from '@/lib/services/sessionService'
import { Livepeer } from 'livepeer'
import { getSrc } from '@livepeer/react/external'
import { EmbedPageParams } from '@/lib/types'

const Embed = ({
  vod,
  playbackId,
  videoSrc,
}: {
  videoSrc?: string
  playbackId: string
  vod?: string
}) => {
  const getVideoUrl = () => {
    if (vod === 'true') return videoSrc
    return `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`
  }
  console.log('videoSrc', videoSrc)

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
      <Player
        src={[
          {
            src: getVideoUrl() as `${string}m3u8`,
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
const EmbedPage = async ({ searchParams }: EmbedPageParams) => {
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const playbackInfo = await livepeer.playback.get(
    searchParams.playbackId
  )
  const src = getSrc(playbackInfo.playbackInfo)

  if (!searchParams.playbackId) {
    return notFound()
  }
  return (
    <Suspense>
      <Embed
        playbackId={searchParams?.playbackId}
        vod={searchParams.vod}
        videoSrc={src?.[1].src}
      />
    </Suspense>
  )
}

export default EmbedPage
