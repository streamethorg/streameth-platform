'use client'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import Player from '@/components/ui/Player'
import { useNavigation } from '../../navigation/navigationContext'
import { useStream } from '@livepeer/react'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import MultistreamCard from './multistream/multistreamCard'

const StreamConfig = ({ stage }: { stage: IStageModel }) => {
  const { selectedStageSetting } = useNavigation()
  const { data: stream, isLoading } = useStream(
    stage.streamSettings.streamId ?? ''
  )

  if (selectedStageSetting !== 'settings') {
    return null
  }

  if (isLoading || !stage.streamSettings.streamId) {
    return null
  }

  return (
    <div className="border-none shadow-none h-full text-foreground">
      <CardHeader>
        <CardTitle>{stage.name} stage</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row gap-4">
        <div className="flex flex-col w-1/2 gap-4">
          <Player
            playerName={stage.name}
            playbackId={stream?.playbackId}
          />
          <Card className="shadow-none border-border">
            <CardHeader>
              <CardTitle>Stream Details</CardTitle>
              <CardDescription>
                {/* id: {isLoading ? stream?.playbackId : 'loading...'} */}
                Copy and paste the stream key into your streaming
                software. Use either the RTMP or SRT ingest, depending
                on your use-case. The RTMP ingest is more common with
                OBS users
              </CardDescription>
            </CardHeader>
            <CardContent className="lg:pt-0 flex flex-col space-y-2">
              <p className="font-bold">RTMP Ingest:</p>
              <p>rtmp://rtmp.livepeer.com/live</p>
              <p className="font-bold">Stream key:</p>
              <p>{stream?.streamKey}</p>
            </CardContent>
            <CardFooter className="flex flex-row justify-between text-sm text-muted-foreground">
              <p>
                Last seen:{' '}
                {new Date(stream?.lastSeen as number).toDateString()}
              </p>
              <p className="ml-auto">
                {stream?.isActive ? 'active' : 'not active'}
              </p>
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col w-1/2 space-y-4">
          <div className="h-1/2">
            <MultistreamCard
              streamId={stage.streamSettings.streamId}
            />
          </div>
          <div className="h-1/2">
            <Card className="shadow-none border-border">
              <CardHeader>
                <CardTitle>Embed Codes</CardTitle>
                <CardDescription>
                  Copy and paste these codes into your website to
                  embed your livestream.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </CardContent>
    </div>
  )
}

export default StreamConfig
