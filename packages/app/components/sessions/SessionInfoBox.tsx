'use client'
import { useState } from 'react'
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'

import ShareButton from '@/components/misc/ShareButton'
import EmbedButton from '@/components/misc/EmbedButton'
import SpeakerIcon from '../speakers/speakerIcon'
import {
  ISpeakerModel,
  ISpeaker,
} from 'streameth-new-server/src/interfaces/speaker.interface'
import VideoDownload from '@/app/(vod)/watch/components/VideoDownload'
import ViewCounts from '@/app/(vod)/watch/components/ViewCounts'
const SessionInfoBox = ({
  title,
  cardDescription,
  description,
  playbackId,
  streamId,
  playerName,
  speakers,
  assetId,
  viewCount,
}: {
  title: string
  cardDescription?: string
  description?: string
  playbackId?: string | undefined
  streamId?: string | undefined
  playerName: string
  speakers?: ISpeaker[]
  assetId?: string
  viewCount?: boolean
}) => {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <div className="">
      <CardHeader className="flex flex-col justify-center py-4 lg:flex-row">
        <div className="flex flex-col">
          <CardTitle className="">{title}</CardTitle>
          <CardDescription>
            {viewCount && assetId && <ViewCounts assetId={assetId} />}

            <div className="flex flex-row">{cardDescription}</div>
          </CardDescription>
        </div>
        <div className="flex flex-row mt-2 space-x-1 lg:my-0 lg:ml-auto">
          <ShareButton />
          <EmbedButton
            streamId={streamId}
            playbackId={playbackId}
            playerName={playerName}
          />
          {assetId && <VideoDownload assetId={assetId} />}
        </div>
      </CardHeader>
      {description !== '' && (
        <CardContent className="relative pt-0 lg:pt-0 rounded-md">
          <div
            className={`transition-max-height duration-700 ease-in-out overflow-hidden ${
              isOpened ? 'max-h-96' : 'max-h-32'
            }`}>
            <div className="">{description}</div>
            <div className="flex flex-row mt-2 space-x-2">
              {speakers &&
                speakers.map((speaker) => (
                  <SpeakerIcon key={speaker._id} speaker={speaker} />
                ))}
            </div>
          </div>
          <button
            onClick={() => setIsOpened(!isOpened)}
            className="absolute mt-2 ml-auto w-full text-right text-secondary-foreground">
            {isOpened ? 'Less' : 'More'}
          </button>
        </CardContent>
      )}
    </div>
  )
}

export default SessionInfoBox
