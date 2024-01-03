'use client'

import {
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

import ShareButton from '@/components/misc/ShareButton'
import EmbedButton from '@/components/misc/EmbedButton'

const SessionInfoBox = ({
  title,
  cardDescription,
  description,
  playbackId,
  streamId,
  playerName,
}: {
  title: string
  cardDescription?: string
  description?: string
  playbackId?: string | undefined
  streamId?: string | undefined
  playerName: string
}) => {
  return (
    <div className="bg-background rounded mt-1">
      <CardHeader className="flex flex-col md:flex-row p-4">
        <div className="flex flex-col">
          <CardTitle className="">{title}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </div>
        <div className="flex flex-row md:ml-auto space-x-1">
          <ShareButton />
          <EmbedButton
            streamId={streamId}
            playbackId={playbackId}
            playerName={playerName}
          />
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <p>{description}</p>
        </CardContent>
      )}
    </div>
  )
}

export default SessionInfoBox
