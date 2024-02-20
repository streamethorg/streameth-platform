'use client'
import React from 'react'
import { createClip } from '@/lib/actions/sessions'
import { Button } from '@/components/ui/button'
import { useClipContext } from './ClipContext'
import { IExtendedSession } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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
          toast.success('Clip created')
        })
        .catch(() => {
          setIsLoading(false)
          toast.error('Error creating clip')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  return (
    <Button
      disabled={isLoading}
      onClick={handleCreateClip}
      className="mt-auto">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
          wait
        </>
      ) : (
        'Clip'
      )}
    </Button>
  )
}

export default CreateClipButton
