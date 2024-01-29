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
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
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

  return (
    <ClipProvider>
      <Card>
        <CardHeader className="pb-0 lg:pb-0">
          <CardTitle>{session.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {!isCreatingClip && currentClip ? (
            <Player
              playerName="studio"
              playbackId={currentClip.playbackId}
            />
          ) : (
            <StudioPlayer />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {isCreatingClip ? (
            <>
              <SessionSelect
                streamId={stage.streamSettings.streamId}
              />
              <div className="flex flex-row w-full space-x-1 items-center">
                <TimeSetter label="Clip start" type="start" />
                <TimeSetter label="Clip end" type="end" />
                <CreateClipButton />
              </div>
            </>
          ) : (
            <div className="flex flex-row justify-between w-full">
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
            </div>
          )}
        </CardFooter>
      </Card>
    </ClipProvider>
  )
}

export default CreateClipCard
