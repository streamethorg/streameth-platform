'use client'
import { useState } from 'react'
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
    <div className=" rounded my-2">
      <div className="flex flex-col lg:flex-row justify-center py-4">
        <div className="flex flex-col justify-center px-2">
          <CardTitle className="text-background">{title}</CardTitle>
          <CardDescription>
            {viewCount && assetId && <ViewCounts assetId={assetId} />}

            <div className="flex flex-row ">{cardDescription}</div>
          </CardDescription>
        </div>
        <div className="flex flex-row lg:ml-auto space-x-1 mt-2 lg:my-0">
          <ShareButton />
          <EmbedButton
            streamId={streamId}
            playbackId={playbackId}
            playerName={playerName}
          />
          {assetId && <VideoDownload assetId={assetId} />}
        </div>
      </div>
      <CardContent className="bg-background rounded-md p-4">
        {description !== '' && (
          <div
            className={`transition-max-height duration-700 ease-in-out overflow-hidden ${
              isOpened ? 'max-h-96' : 'max-h-10'
            }`}>
            <div className="">{description}</div>
            <div className="flex flex-row mt-2">
              {speakers &&
                speakers.map((speaker) => (
                  <SpeakerIcon key={speaker.id} speaker={speaker} />
                ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpened(!isOpened)}
          className="mt-2 ml-auto w-full text-right text-white">
          {isOpened ? 'Less' : 'More'}
        </button>
      </CardContent>
    </div>
  )
}

export default SessionInfoBox
