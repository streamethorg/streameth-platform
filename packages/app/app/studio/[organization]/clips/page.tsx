import React from 'react'
import { ClipsPageParams } from '@/lib/types'
import SelectSession from './components/SelectSession'
import RecordingSelect from './components/RecordingSelect'
import TimeSetter from './components/TimeSetter'
import CreateClipButton from './components/CreateClipButton'
import { ClipProvider } from './components/ClipContext'
import ReactHlsPlayer from './components/Player'
import { fetchStages } from '@/lib/services/stageService'
import { getStreamRecordings } from '@/lib/actions/livepeer'
import { fetchAllSessions } from '@/lib/data'
import { fetchEvent } from '@/lib/services/eventService'
import { CardTitle } from '@/components/ui/card'
import { Film } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import VideoCard from '@/components/misc/VideoCard'
const ClipContainer = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <div className="w-full h-full ">
    <div className="flex flex-row h-full w-full mx-auto">
      {children}
    </div>
  </div>
)

const EventClips = async ({
  params,
  searchParams,
}: ClipsPageParams) => {
  const { stage, selectedRecording } = searchParams

  const stages = await fetchStages({
    organizationId: params.organization,
  })

  if (stages.length === 0) {
    return (
      <ClipContainer>
        <div className="text-center max-w-[500px] space-y-4 w-full border rounded-lg p-4 mx-auto flex bg-background flex-col justify-center items-center h-full">
          <Film className="p-4 rounded-lg" size={84} />
          <p className=" font-bold text-lg">Clip a livestream!</p>
          <p className="text-sm text-foreground-muted">
            You dont have any stages to clip from, first create a
            livestream to get started
          </p>
          <Link href={`/studio/${params.organization}/upload`}>
            <Button>Create a livestream</Button>
          </Link>
        </div>
      </ClipContainer>
    )
  }

  const currentStage = stages.find((s) => {
    console.log('s.id', s._id, stage)
    return s._id === stage
  })

  if (!currentStage) {
    return (
      <ClipContainer>
        <div className="flex max-w-[500px] h-auto mx-auto flex-col w-full p-4 items-center space-y-4">
          <SelectSession stages={stages} currentStageId={stage} />
          <div className="bg-white text-center  space-y-2 w-full border rounded-lg p-4 mx-auto flex bg-background flex-col justify-center items-center h-full">
            <Film className="p-4 rounded-lg" size={84} />
            <p className=" font-bold text-lg">Clip a livestream!</p>
            <p className="text-sm text-foreground-muted">
              Please select a livestream that has a recordings from
              the dropdown above
            </p>
            <p className="font-bold">or</p>

            <Link href={`/studio/${params.organization}/upload`}>
              <Button>Create a livestream</Button>
            </Link>
          </div>
        </div>
      </ClipContainer>
    )
  }

  const stageRecordings = await getStreamRecordings({
    streamId: currentStage?.streamSettings?.streamId ?? '',
  })

  const currentRecording = (function () {
    if (selectedRecording) {
      const recording = stageRecordings.recordings.find(
        (recording) => recording.id === selectedRecording
      )
      if (recording) {
        return recording.id ?? null
      }
      return null
    }
    return null
  })()

  if (stageRecordings.recordings.length === 0) {
    return (
      <ClipContainer>
        <div className="flex flex-col w-full p-4 max-w-[500px] space-y-4 mx-auto mb-auto">
          <SelectSession stages={stages} currentStageId={stage} />
          <div className="text-center bg-white  space-y-2 w-full border rounded-lg p-8 mx-auto flex bg-background flex-col justify-center items-center h-full">
            <Film className="p-4 rounded-lg" size={84} />
            <p className=" font-bold text-lg">No recordings</p>
            <p className="text-sm text-foreground-muted">
              This stream does not have any recordings, go live and come back to clip to clip your livestream 
            </p>
            <Link href={`/studio/${params.organization}/upload`}>
              <Button>Go Live</Button>
            </Link>
          </div>
        </div>
      </ClipContainer>
    )
  }

  if (!currentRecording) {
    return (
      <ClipContainer>
        <div className="flex flex-col w-full p-4 max-w-[500px] mx-auto mb-auto space-y-4">
          <SelectSession stages={stages} currentStageId={stage} />
          <RecordingSelect
            streamRecordings={stageRecordings.recordings}
          />
          <div className="bg-white text-center  space-y-2 w-full border rounded-lg p-4 mx-auto flex bg-background flex-col justify-center items-center h-full">
            <Film className="p-4 rounded-lg" size={84} />
            <p className=" font-bold text-lg">Clip a livestream!</p>
            <p className="text-sm text-foreground-muted">
              Please select a livestream recording from the dropdown
              above
            </p>
          </div>
        </div>
      </ClipContainer>
    )
  }
  const event = await fetchEvent({
    eventId: currentStage.eventId as string,
  })

  const sessions = await fetchAllSessions({
    event: event?.slug,
    stageId: currentStage._id,
  })

  return (
    <ClipContainer>
      <div className="flex flex-col w-full p-8 ">
        <div className="flex flex-row justify-center space-x-4 my-4 w-full">
          <SelectSession
            stages={stages}
            currentStageId={currentStage.id}
          />
          <RecordingSelect
            selectedRecording={currentRecording ?? undefined}
            streamRecordings={stageRecordings.recordings}
          />
        </div>
        <SessionContent
          stageName={currentStage.name}
          selectedRecording={currentRecording}
          parentStream={
            stageRecordings.parentStream?.playbackId ?? ''
          }
        />
      </div>
      {sessions.sessions && event && (
        <div className="w-1/3 h-full bg-background bg-white border-l">
          <CardTitle className="bg-white p-2 border-b">
            Livestream clips
          </CardTitle>
          <div className="h-[calc(100%-50px)] overflow-y-scroll">
            {sessions.sessions.map((session) => (
              <div key={session._id} className="px-4 py-2">
                <VideoCard session={session} />
              </div>
            ))}
          </div>
        </div>
      )}
    </ClipContainer>
  )
}
const SessionContent = async ({
  selectedRecording,
  parentStream,
  stageName,
}: {
  selectedRecording: string
  parentStream: string
  stageName: string
}) => {
  return (
    <div className="flex flex-col w-full h-full overflow-auto space-y-4">
      <ClipProvider>
        <ReactHlsPlayer
          playbackId={parentStream}
          selectedStreamSession={selectedRecording}
        />
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row w-full space-x-2 items-center justify-center">
            <TimeSetter label="Clip start" type="start" />
            <TimeSetter label="Clip end" type="end" />
            <CreateClipButton
              selectedRecording={selectedRecording}
              playbackId={parentStream}
            />
          </div>
        </div>
      </ClipProvider>
    </div>
  )
}

export default EventClips
