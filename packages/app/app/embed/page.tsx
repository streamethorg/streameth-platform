import Player from '@/components/ui/Player'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Livepeer } from 'livepeer'
import { getSrc } from '@livepeer/react/external'
import { EmbedPageParams } from '@/lib/types'
import { fetchStage } from '@/lib/services/stageService'
import { buildPlaybackUrl } from '@/lib/utils/utils'

const Embed = ({ src }: { src: string }) => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
      <Player
        src={[
          {
            src: src as `${string}m3u8`,
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

const legacyFetch = async (playbackId: string, vod?: boolean) => {
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const playbackInfo = await livepeer.playback.get(playbackId)
  const src = getSrc(playbackInfo.playbackInfo)
  if (src) {
    return buildPlaybackUrl(src[1].src, vod)
  }
}

const EmbedPage = async ({ searchParams }: EmbedPageParams) => {
  if (!searchParams.playbackId && !searchParams.streamId) {
    return notFound()
  }

  if (searchParams.playbackId) {
    const src = await legacyFetch(searchParams.playbackId)
    if (!src) {
      return notFound()
    }
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Embed src={src} />
      </Suspense>
    )
  }


  if (searchParams.streamId) {
    const stage = await fetchStage({
      stage: searchParams.streamId,
    })

    if (!stage) {
      return notFound()
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Embed src={stage.streamSettings?.playbackId} />
      </Suspense>
    )
  }
}

export default EmbedPage
