'use client'
import { useEffect, useState } from 'react'
import { useAsset } from '@livepeer/react'
import StudioPlayer from './Player'
import {
  CardContent,
  CardFooter,
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SessionSelect from './SessionSelect'
import CreateClipButton from './CreateClipButton'
import TimeSetter from './TimeSetter'
import { ClipProvider } from './ClipContext'
import Player from '@/components/ui/Player'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'

const CreateClipCard = ({
  stage,
  session,
}: {
  stage: IStageModel
  session: ISessionModel
}) => {
  const { data: currentClip } = useAsset({
    assetId: session.assetId,
  })

  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(
    session.assetId ? false : true
  )

  useEffect(() => {
    setIsCreatingClip(session.assetId ? false : true)
  }, [session])

  if (!stage.streamSettings.streamId) {
    return <div>this stage has no stream</div>
  }

  return (
    <ClipProvider>
      <div className="px-2 space-y-2">
        <div>
          {!isCreatingClip && currentClip ? (
            <Player
              playerName="studio"
              playbackId={currentClip.playbackId}
            />
          ) : (
            <StudioPlayer />
          )}
        </div>
        <Card className="flex flex-col space-y-2 shadow-none border-border">
          {isCreatingClip ? (
            <CardContent>
              <SessionSelect
                streamId={stage.streamSettings.streamId}
              />
              <div className="flex flex-row w-full space-x-1 items-center">
                <TimeSetter label="Clip start" type="start" />
                <TimeSetter label="Clip end" type="end" />
                <CreateClipButton />
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
