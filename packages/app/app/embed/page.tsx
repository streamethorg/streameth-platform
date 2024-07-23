import Player from '@/components/ui/Player'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { EmbedPageParams } from '@/lib/types'
import { fetchStage } from '@/lib/services/stageService'
import { buildPlaybackUrl } from '@/lib/utils/utils'
import { fetchSession } from '@/lib/services/sessionService'
import { getVideoUrlAction } from '@/lib/actions/livepeer'

const Embed = ({
  src,
  thumbnail,
  name,
}: {
  src: string
  thumbnail?: string
  name?: string
}) => {
  return (
    <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-black">
      <Player
        thumbnail={thumbnail}
        name={name}
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

const EmbedPage = async ({ searchParams }: EmbedPageParams) => {
  if (
    !searchParams.playbackId &&
    !searchParams.stage &&
    !searchParams.session
  ) {
    return notFound()
  }

  if (searchParams.playbackId) {
    const src = buildPlaybackUrl(
      searchParams.playbackId,
      Boolean(searchParams?.vod)
    )

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Embed src={src} />
      </Suspense>
    )
  }

  if (searchParams.stage) {
    const stage = await fetchStage({
      stage: searchParams.stage,
    })

    if (!stage || !stage.streamSettings?.playbackId) {
      return notFound()
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Embed
          src={buildPlaybackUrl(stage.streamSettings.playbackId)}
          thumbnail={stage.thumbnail}
          name={stage.name}
        />
      </Suspense>
    )
  }

  if (searchParams.session) {
    const session = await fetchSession({
      session: searchParams.session,
    })

    if (!session || (!session.playbackId && !session.assetId)) {
      return notFound()
    }

    const videoUrl = await getVideoUrlAction(
      session.assetId as string
    )

    if (!videoUrl) {
      return notFound()
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Embed
          src={videoUrl}
          thumbnail={session.coverImage}
          name={session.name}
        />
      </Suspense>
    )
  }
}

export default EmbedPage
