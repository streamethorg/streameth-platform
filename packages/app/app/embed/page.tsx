'use client'
import Player from '@/components/ui/Player'
import { buildPlaybackUrl } from '@/lib/utils/utils'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

const Embed = () => {
  const { searchParams } = useSearchParams()
  const playbackId = searchParams.get('playbackId')
  const vod = searchParams.get('vod') === 'true'
  if (!playbackId) {
    return notFound()
  }

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black flex justify-center items-center">
      <Player
        src={[
          {
            src: buildPlaybackUrl(playbackId, vod) as `${string}m3u8`,
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
const EmbedPage = () => (
  <Suspense>
    <Embed />
  </Suspense>
)

export default EmbedPage
