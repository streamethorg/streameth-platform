'use client'
import React from 'react'
import {
  createClipAction,
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
import {
  IExtendedOrganization,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types'
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

const ClipButton = ({
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
  const { startTime, endTime } = useClipContext()
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

    if (!endTime || !startTime || startTime < endTime) {
      toast.error('Start time must be earlier than end time.')
      return
    }

    if (!selectedRecording) {
      toast.error('No recording selected.')
      return
    }

    if (!session) {
      toast.error('Session information is missing.')
      return
    }

    setIsLoading(true)
    createClipAction({
      playbackId,
      recordingId: selectedRecording,
      start: startTime.unix,
      end: endTime.unix,
      sessionId: session._id as string,
    })
      .then(() => {
        setIsLoading(false)
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

  return (
    <div className="flex flex-col space-y-2 flex-grow">
      <div className="flex flex-col flex-grow space-y-2 my-4">
        <Label>{custom ? 'Session name' : 'Select Session'}</Label>
        {custom ? (
          <Input
            id="session-name"
            className=" bg-white z-[999999]"
            placeholder="Enter session name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <Select onValueChange={(value) => setSessionId(value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent className="bg-white !justify-start z-[999999]">
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
          (custom ? !name : !sessionId)
        }
        onClick={handleCreateClip}
        variant="primary"
        className="mt-auto text-white">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
            wait
          </>
        ) : (
          'Create clip'
        )}
      </Button>
    </div>
  )
}

const CreateClipButton = ({
  currentRecording,
  organization,
  currentStage,
  sessions,
  playbackId,
}: {
  currentRecording: string
  organization: IExtendedOrganization
  playbackId: string
  currentStage: IExtendedStage
  sessions: {
    sessions: IExtendedSession[]
  }
}) => {
  const { isLoading } = useClipContext()

  return (
    <Dialog>
      <DialogContent className="bg-white">
        <div className="flex flex-col h-[300px] bg-white p-4">
          <Tabs defaultValue={'sessions'}>
            <TabsList className="border-y border-grey w-full !justify-start gap-5">
              {sessions.sessions.length > 0 && (
                <TabsTrigger className="px-0" value="sessions">
                  Clip Session
                </TabsTrigger>
              )}
              <TabsTrigger value="custom">
                Create Custom Clip
              </TabsTrigger>
            </TabsList>
            {sessions.sessions.length > 0 && (
              <TabsContent value="sessions">
                <div className="flex flex-row w-full space-x-2 items-center justify-center">
                  <ClipButton
                    selectedRecording={currentRecording}
                    playbackId={playbackId}
                    stageId={currentStage?._id}
                    organizationId={organization._id as string}
                    sessions={sessions.sessions}
                  />
                </div>
              </TabsContent>
            )}
            <TabsContent value="custom">
              <div className="flex flex-row w-full space-x-2 items-center justify-center">
                <ClipButton
                  selectedRecording={currentRecording}
                  playbackId={playbackId}
                  stageId={currentStage?._id}
                  organizationId={organization._id as string}
                  sessions={sessions.sessions}
                  custom
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
      <DialogTrigger>
        <Button
          variant="primary"
          className="w-full"
          disabled={isLoading}>
          Create Clip
        </Button>
      </DialogTrigger>
    </Dialog>
  )
}

export default CreateClipButton
