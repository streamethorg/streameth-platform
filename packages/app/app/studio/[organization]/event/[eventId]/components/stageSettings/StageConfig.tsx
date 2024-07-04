import { fetchStage } from '@/lib/services/stageService'
import LivestreamEmbedCode from '@/app/studio/[organization]/livestreams/[streamId]/components/LivestreamEmbedCode'
import Multistream from '@/app/studio/[organization]/livestreams/[streamId]/components/Multistream'
import StreamConfigWithPlayer from '@/app/studio/[organization]/livestreams/[streamId]/components/StreamConfigWithPlayer'
import StreamHeader from '@/app/studio/[organization]/livestreams/[streamId]/components/StreamHeader'

const StreamConfig = async ({
  organization,
  stageId,
}: {
  organization: string
  stageId: string
}) => {
  const stage = await fetchStage({ stage: stageId })
  if (!stage || !stage.streamSettings?.streamId) {
    return <div> no stage found</div>
  }

  return (
    <div className="m-auto flex max-w-5xl flex-col items-center gap-4 p-4">
      <StreamHeader organization={organization} stream={stage} />

      <StreamConfigWithPlayer
        organization={stage.organizationId as string}
        streamId={stageId}
        stream={stage}
      />

      <Multistream
        organizationId={stage.organizationId as string}
        stream={stage}
      />

      <LivestreamEmbedCode
        streamId={stage?.streamSettings?.streamId}
        playbackId={stage?.streamSettings?.playbackId}
        playerName={stage?.name}
      />
    </div>
  )
}

export default StreamConfig
