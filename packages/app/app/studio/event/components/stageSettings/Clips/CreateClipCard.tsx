'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  StreamSession,
  useAsset,
  useStreamSessions,
  MediaControllerCallbackState,
  useCreateClip,
  Player,
} from '@livepeer/react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  CardContent,
  CardFooter,
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import IStage from 'streameth-server/model/stage'
import { Button } from '@/components/ui/button'
import { ISession } from 'streameth-server/model/session'
const CreateClipCard = ({
  stage,
  session,
}: {
  stage: IStage
  session: ISession
}) => {
  const { data: streamSessions, isLoading } = useStreamSessions({
    streamId: stage.streamSettings.streamId,
  })

  const { data: asset } = useAsset({
    assetId: session.assetId,
  })

  const [selectedStreamSession, setSelectedStreamSession] =
    useState<StreamSession | null>()

  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(
    session.assetId ? false : true
  )

  type PlaybackStatus = {
    progress: number
    offset: number
  }

  type PlaybackStartEnd = {
    displayTime: string
    unix: number
  }

  const [playbackStatus, setPlaybackStatus] =
    useState<PlaybackStatus | null>()
  const [startTime, setStartTime] =
    useState<PlaybackStartEnd | null>()
  const [endTime, setEndTime] = useState<PlaybackStartEnd | null>()

  const onPlaybackStatusUpdate = useCallback(
    (state: { progress: number; offset: number }) => {
      setPlaybackStatus(state)
    },
    []
  )
  const playbackStatusSelector = useCallback(
    (
      state: MediaControllerCallbackState<HTMLMediaElement, never>
    ) => {
      return {
        progress: Number(state.progress.toFixed(1)),
        offset: Number(state.playbackOffsetMs?.toFixed(1) ?? 0),
      }
    },
    []
  )

  const {
    data: clipAsset,
    mutateAsync,
    isLoading: createClipLoading,
  } = useCreateClip({
    playbackId: selectedStreamSession
      ? selectedStreamSession.playbackId
      : '',
    startTime: startTime?.unix ?? 0,
    endTime: endTime?.unix ?? 0,
  })

  useEffect(() => {
    setIsCreatingClip(session.assetId ? false : true)
    setSelectedStreamSession(null)
  }, [session])

  useEffect(() => {
    console.log(startTime, endTime)
    if (clipAsset) {
      setIsCreatingClip(false)
      setSelectedStreamSession(null)
    }
  }, [clipAsset, startTime, endTime])
  return (
    <Card>
      <CardHeader>
        <CardTitle>{session.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Player
          // src={
          //   isCreatingClip
          //     ?
          //     : undefined
          // }
          src={selectedStreamSession?.recordingUrl}
          // playbackId={selectedStreamSession?.playbackId}
          autoPlay
          muted
          playbackStatusSelector={playbackStatusSelector}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {isCreatingClip ? (
          <>
            {streamSessions && (
              <Select
                defaultValue={
                  streamSessions ? streamSessions[0].id : ''
                }
                onValueChange={(value) => {
                  setSelectedStreamSession((prev) =>
                    streamSessions.find(
                      (session) => session.id === value
                    )
                  )
                }}>
                <SelectTrigger>
                  <SelectValue>
                    {selectedStreamSession?.lastSeen
                      ? new Date(
                          selectedStreamSession?.lastSeen
                        ).toUTCString()
                      : 'Select livestream to clip from'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {streamSessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.lastSeen &&
                          new Date(session.lastSeen).toUTCString()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <div className="flex flex-row w-full space-x-1 items-center">
              <div className="flex-grow">
                <Label>Clip start</Label>
                <Input type="number" value={startTime?.displayTime} />
                <Button
                  type="button"
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:shadow-none"
                  onClick={() => {
                    const progress = playbackStatus?.progress
                    const offset = playbackStatus?.offset
                    console.log(
                      progress,
                      offset,
                      progress && offset,
                      'clikc start'
                    )
                    if (
                      progress !== undefined &&
                      offset !== undefined
                    ) {
                      const calculatedTime = Date.now() - offset
                      setStartTime({
                        unix: calculatedTime,
                        displayTime: progress.toFixed(0).toString(),
                      })
                    }
                  }}>
                  Set Start
                </Button>
              </div>
              <div className="flex-grow">
                <Label>Clip end</Label>
                <Input
                  type="number"
                  value={endTime?.displayTime ?? ''}
                />
                <Button
                  type="button"
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none"
                  onClick={() => {
                    const progress = playbackStatus?.progress
                    const offset = playbackStatus?.offset

                    if (
                      progress !== undefined &&
                      offset !== undefined
                    ) {
                      const calculatedTime = Date.now() - offset
                      setEndTime({
                        unix: calculatedTime,
                        displayTime: progress.toFixed(0).toString(),
                      })
                    }
                  }}>
                  Set End
                </Button>
              </div>
              <Button
                className="mt-auto"
                onClick={() => {
                  setStartTime(null)
                  setEndTime(null)
                  mutateAsync()
                }}
                disabled={!startTime || !endTime || isLoading}>
                Create Clip
              </Button>
            </div>
          </>
        ) : (
          <div>
            <p>{session.name}</p>
            <Button onClick={() => setIsCreatingClip(true)}>
              Replace Clip
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default CreateClipCard
