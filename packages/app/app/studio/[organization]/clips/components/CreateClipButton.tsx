'use client'
import React from 'react'
import {
  createClip,
  createSessionAction,
} from '@/lib/actions/sessions'
import { Button } from '@/components/ui/button'
import { useClipContext } from './ClipContext'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface'
const CreateClipButton = ({
  playbackId,
  selectedRecording,
  stageId,
  session,
  organizationId,
}: {
  playbackId: string
  selectedRecording: string
  stageId: string
  organizationId: string
  session?: any
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const { startTime, setStartTime, endTime, setEndTime } =
    useClipContext()

  const { handleTermChange } = useSearchParams()
  const handleCreateClip = async () => {
    if (!session) {
      session = await createSessionAction({
        session: {
          name,
          description: 'Clip',
          start: new Date().getTime(),
          end: new Date().getTime(),
          stageId,
          organizationId,
          speakers: [],
          type: SessionType['clip'],
        },
      })
    }

    if (selectedRecording && startTime && endTime && session) {
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
          handleTermChange([
            {
              key: 'previewId',
              value: session._id,
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
        className=' bg-white'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button
        disabled={
          isLoading || !selectedRecording || !startTime || !endTime || !name
        }
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
