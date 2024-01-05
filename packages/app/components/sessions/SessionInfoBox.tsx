'use client'

import {
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

import ShareButton from '@/components/misc/ShareButton'
import EmbedButton from '@/components/misc/EmbedButton'
import SpeakerIcon from '../speakers/speakerIcon'
import { ISpeaker } from 'streameth-server/model/speaker'
import VideoDownload from '@/app/(vod)/watch/components/VideoDownload'
const SessionInfoBox = ({
  title,
  cardDescription,
  description,
  playbackId,
  streamId,
  playerName,
  speakers,
  videoDownload,
}: {
  title: string
  cardDescription?: string
  description?: string
  playbackId?: string | undefined
  streamId?: string | undefined
  playerName: string
  speakers?: ISpeaker[]
  videoDownload?: boolean
}) => {
  return (
    <div className=" rounded mt-1">
      <div className="flex flex-col md:flex-row justify-center py-4">
        <div className="flex flex-col justify-center">
          <CardTitle className="text-background">{title}</CardTitle>
          <CardDescription>
            {/* <div className="flex flex-row">{cardDescription}</div> */}
          </CardDescription>
        </div>
        <div className="flex flex-row md:ml-auto space-x-1">
          <ShareButton />
          <EmbedButton
            streamId={streamId}
            playbackId={playbackId}
            playerName={playerName}
          />
          {/* { videoDownload && <VideoDownload
            playbackId={playbackId}
            title={playerName}
          /> } */}
        </div>
      </div>
      {description && (
        <CardContent className="md:p-0 flex flex-col">
          <p className="bg-background rounded-md p-4">
            {description}
          </p>
          <div className="flex flex-row mt-2">
            {speakers &&
              speakers.map((speaker) => (
                <SpeakerIcon key={speaker.id} speaker={speaker} />
              ))}
          </div>
        </CardContent>
      )}
    </div>
  )
}

export default SessionInfoBox
