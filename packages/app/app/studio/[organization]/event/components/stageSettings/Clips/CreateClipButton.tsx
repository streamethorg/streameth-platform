'use client'
import React from 'react'

import { useCreateClip, Player } from '@livepeer/react'
import { Button } from '@/components/ui/button'
import { useClipContext } from './ClipContext'

const CreateClipButton = () => {
  const {
    selectedStreamSession,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
  } = useClipContext()

  const {
    data: clipAsset,
    mutateAsync,
    isLoading,
  } = useCreateClip({
    playbackId: selectedStreamSession
      ? //@ts-ignore wrong type provide by sdk
        selectedStreamSession.playbackId
      : '',
    startTime: startTime?.unix ?? 0,
    endTime: endTime?.unix ?? 0,
  })

  return (
    <Button
      className="mt-auto"
      variant={'secondary'}
      onClick={() => {
        mutateAsync()
        setStartTime(null)
        setEndTime(null)
      }}
      disabled={!startTime || !endTime || isLoading}>
      Create Clip
    </Button>
  )
}

export default CreateClipButton
