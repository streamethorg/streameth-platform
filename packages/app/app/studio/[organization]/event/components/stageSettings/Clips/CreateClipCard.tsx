'use client'
import { useEffect, useState } from 'react'
import { useAsset, useStream } from '@livepeer/react'
import StudioPlayer from './Player'
import { CardContent, Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SessionSelect from './SessionSelect'
import CreateClipButton from './CreateClipButton'
import TimeSetter from './TimeSetter'
import { ClipProvider } from './ClipContext'
import Player from '@/components/ui/Player'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { IExtendedSession } from '@/lib/types'

const CreateClipCard = ({
  stage,
  session,
}: {
  stage: IStageModel
  session: IExtendedSession
}) => {
  const { data: currentClip } = useAsset({
    assetId: session.assetId,
  })

  const { data: parentStream } = useStream({
    streamId: stage.streamSettings.streamId,
  })

  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(
    session.assetId ? false : true
  )

  useEffect(() => {
    setIsCreatingClip(session.assetId ? false : true)
  }, [session])

  if (!parentStream) {
    return <div>this stage has no stream</div>
  }

  return (
    <ClipProvider>
      <div className="px-2 space-y-2">
        {session.name}
        <div>
          {!isCreatingClip && currentClip ? (
            <Player
              playerName="studio"
              playbackId={currentClip.playbackId}
            />
          ) : (
            <StudioPlayer playbackId={parentStream?.playbackId} />
          )}
        </div>
        <Card className="flex flex-col space-y-2 shadow-none border-border">
          {isCreatingClip ? (
            <CardContent>
              <SessionSelect streamId={parentStream.id} />
              <div className="flex flex-row w-full space-x-1 items-center">
                <TimeSetter label="Clip start" type="start" />
                <TimeSetter label="Clip end" type="end" />
                <CreateClipButton
                  playbackId={parentStream.playbackId}
                  session={session}
                />
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex flex-row justify-between w-full">
              <div className="flex flex-col mr-auto">
                <p>Clip processing: {currentClip?.status?.phase}</p>
                <p>Progress: {currentClip?.status?.progress}</p>
                {currentClip?.status?.errorMessage && (
                  <p>Error: {currentClip?.status?.errorMessage}</p>
                )}
              </div>
              <Button
                variant={'secondary'}
                onClick={() => setIsCreatingClip(true)}>
                Replace Clip
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </ClipProvider>
  )
}

export default CreateClipCard
