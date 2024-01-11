'use client'
import { useStream } from '@livepeer/react'
import { IStage } from 'streameth-server/model/stage'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import Player from '@/components/ui/Player'
import { Input } from '@/components/ui/input'

const StageSettings = ({ stage }: { stage: IStage }) => {
  const { data } = useStream(stage.streamSettings.streamId)

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{stage.name}</CardTitle>
      </CardHeader>
      <div className="flex flex-row space-y-4">
        <div className="flex flex-col w-1/2 p-2">
          <Player
            playerName={stage.name}
            playbackId={data?.playbackId}
          />
          <div className="p-2 rounded-md space-y-4">
            <div className="flex flex-col space-y-2">
              <p className="text-xl font-bold">
                Streaming software setup
              </p>
              <p className="text-base">
                Copy and paste the stream key into your streaming
                software. Use either the RTMP or SRT ingest, depending
                on your use-case. The RTMP ingest is more common with
                OBS users
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="font-bold">RTMP Ingest:</p>
              <p>rtmp://rtmp.livepeer.com/live</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="font-bold">Stream key:</p>
              <p>{data?.streamKey}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between w-1/2 p-2">
          <div className="flex flex-col"></div>
          <div className="flex flex-col">
            <p className="text-xl font-bold">Debug</p>
            <p>{data?.isActive ? 'Active' : 'Not active'}</p>
            <p>playbackId: {data?.playbackId}</p>
            <p>Ingest rate: {data?.ingestRate}</p>
            <p>
              Last seen:{' '}
              {new Date(Number(data?.lastSeen)).toDateString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default StageSettings
