'use client'
import React from 'react'
import { createClip } from '@/lib/actions/sessions'
import { Button } from '@/components/ui/button'
import { useClipContext } from './ClipContext'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
const CreateClipButton = ({
  playbackId,
  selectedRecording,
  session,
}: {
  playbackId: string
  selectedRecording: string
  session?: any
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const { startTime, setStartTime, endTime, setEndTime } =
    useClipContext()

  const { handleTermChange } = useSearchParams()
  const handleCreateClip = () => {
    if (selectedRecording && startTime && endTime) {
      setIsLoading(true)
      createClip({
        playbackId,
        sessionId: selectedRecording,
        start: startTime.unix,
        end: endTime.unix,
        session: {
          _id: selectedRecording,
        },
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
          handleTermChange([
            {
              key: 'replaceAsset',
              value: '',
            },
          ])
          setIsLoading(false)
        })
    }
  }

  return (
    <div className="flex flex-row space-x-2">
      <div className="flex flex-col space-y-2">
        <Label>Clip name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button
        disabled={isLoading || !selectedRecording || !startTime || !endTime}
        onClick={handleCreateClip}
        variant="primary"
        className="mt-auto text-white">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
            wait
          </>
        ) : (
          'Create clip'
        )}
      </Button>
    </div>
  )
}

export default CreateClipButton
