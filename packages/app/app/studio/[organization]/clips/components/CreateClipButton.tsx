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
import {
  ISession,
  SessionType,
} from 'streameth-new-server/src/interfaces/session.interface'
import { IExtendedSession } from '@/lib/types'
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
const CreateClipButton = ({
  playbackId,
  selectedRecording,
  stageId,
  organizationId,
  sessions,
  custom,
}: {
  playbackId: string
  selectedRecording: string
  stageId?: string
  organizationId: string
  sessions: IExtendedSession[]
  custom?: boolean
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const { startTime, setStartTime, endTime, setEndTime } =
    useClipContext()
  const [sessionId, setSessionId] = React.useState('')

  const { handleTermChange } = useSearchParams()
  const handleCreateClip = async () => {
    let customSession: ISession = {
      name,
      description: 'Clip',
      start: new Date().getTime(),
      end: new Date().getTime(),
      stageId,
      organizationId,
      speakers: [],
      type: SessionType['clip'],
    }
    if (custom) {
      customSession = await createSessionAction({
        session: { ...customSession },
      })
    }

    const session = custom
      ? customSession
      : sessions.find((s) => s._id === sessionId)
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
          setSessionId('')
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
              value: session._id as string,
            },
          ])
          setIsLoading(false)
        })
    }
  }

  return (
    <div className="flex flex-row space-x-2">
      <div className="flex flex-col space-y-2 w-[150px]">
        <Label>{custom ? 'Session name' : 'Select Session'}</Label>
        {custom ? (
          <Input
            className=" bg-white"
            placeholder="Enter session name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <Select onValueChange={(value) => setSessionId(value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent className="bg-white max-w-[400px] !justify-start">
              {sessions?.map((session) => (
                <SelectItem key={session._id} value={session._id}>
                  {session.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <Button
        disabled={
          isLoading ||
          !selectedRecording ||
          !startTime ||
          !endTime ||
          custom
            ? !name
            : !sessionId
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
