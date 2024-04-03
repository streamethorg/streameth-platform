import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { PlayerWithControls } from '@/components/ui/Player'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import MultistreamCard from './multistream/multistreamCard'
import { getStageStream } from '@/lib/actions/stages'
import { fetchStage } from '@/lib/services/stageService'
import LivestreamEmbedCode from '@/app/studio/[organization]/livestreams/[streamId]/components/LivestreamEmbedCode'
import Multistream from '@/app/studio/[organization]/livestreams/[streamId]/components/Multistream'
import StreamHealth from '@/app/studio/[organization]/livestreams/[streamId]/components/StreamHealth'
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
  const data = await getStageStream(stage.streamSettings?.streamId)

  if (!data) {
    return <div> no stream data found</div>
  }
  return (
    <div className="flex flex-col items-center gap-4 p-4 m-auto max-w-5xl">
      <StreamHeader organization={organization} stream={stage} />

      <StreamConfigWithPlayer stream={stage} />

      <StreamHealth
        organization={stage.organizationId as string}
        streamId={stageId}
        stream={stage}
      />

      <Multistream stream={stage} />

      <LivestreamEmbedCode
        streamId={stage?.streamSettings?.streamId}
        playbackId={stage?.streamSettings?.playbackId}
        playerName={stage?.name}
      />
    </div>
  )
}

export const StreamConfigSkeleton = () => {
  return (
    <div className="border-none shadow-none h-full text-black animate-pulse">
      <div className="p-4">
        <div className="h-8 bg-gray-300 rounded-md w-3/4"></div>
      </div>
      <div className="flex flex-row gap-4 p-4">
        <div className="flex flex-col w-1/2 gap-4">
          <div className="bg-gray-300 rounded-md h-64 w-full"></div>
          <div className="shadow-none border-border p-4 bg-white">
            <div className="bg-gray-300 rounded-md h-6 w-1/2 mb-2"></div>
            <div className="bg-gray-300 rounded-md h-4 w-full mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-300 rounded-md h-4 w-1/3 mb-2"></div>
              <div className="bg-gray-300 rounded-md h-4 w-full mb-2"></div>
              <div className="bg-gray-300 rounded-md h-4 w-1/3 mb-2"></div>
              <div className="bg-gray-300 rounded-md h-4 w-full"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/2 space-y-4">
          <div className="bg-gray-300 rounded-md h-64 w-full"></div>
          <div className="bg-gray-300 rounded-md h-64 w-full"></div>
        </div>
      </div>
    </div>
  )
}

export default StreamConfig
