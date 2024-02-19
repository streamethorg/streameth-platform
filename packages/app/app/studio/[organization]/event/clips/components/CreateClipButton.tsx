'use client'
import React from 'react'
import { createClip } from '@/lib/actions/sessions'
import { Button } from '@/components/ui/button'
import { useClipContext } from './ClipContext'
import { IExtendedSession } from '@/lib/types'

const CreateClipButton = ({
  playbackId,
  session,
  selectedRecording,
}: {
  playbackId: string
  selectedRecording: string
  session: IExtendedSession
}) => {
  const [isLoading, setIsLoading] = React.useState(false)

  const { startTime, setStartTime, endTime, setEndTime } =
    useClipContext()

  const handleCreateClip = () => {
    if (selectedRecording && startTime && endTime) {
      setIsLoading(true)
      createClip({
        playbackId,
        sessionId: selectedRecording,
        start: startTime.unix,
        end: endTime.unix,
        session,
      })
        .then(() => {
          setIsLoading(false)
          setStartTime(null)
          setEndTime(null)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  return (
    <Button
      className="mt-auto"
      variant={'secondary'}
      onClick={handleCreateClip}>
      Create Clip
    </Button>
  )
}

export default CreateClipButton
