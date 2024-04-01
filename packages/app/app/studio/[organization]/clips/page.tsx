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
import SessionList from '@/components/sessions/SessionList'
import { fetchAllSessions } from '@/lib/data'
import { fetchEvent } from '@/lib/services/eventService'
import { CardTitle } from '@/components/ui/card'

const EventClips = async ({
  params,
  searchParams,
}: ClipsPageParams) => {
  const { stage, selectedRecording } = searchParams

  const stages = await fetchStages({
    organizationId: params.organization,
  })

  if (stages.length === 0) {
    return <div>No stages found for this organization</div>
  }

  const sessions = await fetchAllSessions({
    searchQuery: stage,
  })

  const currentStage = stages.find((s) => s.id === stage) ?? stages[0]

  const event = await fetchEvent({
    eventId: currentStage.eventId as string,
  })

  const stageRecordings = await getStreamRecordings({
    streamId: currentStage.streamSettings.streamId ?? '',
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
    return stageRecordings.recordings[0]?.id ?? null
  })()

  return (
    <div className="w-full h-full bg-white">
      {/* {(sessions.sessions && event) && <SessionList event={event} sessions={sessions.sessions} />} */}
      <div className="flex flex-col max-w-5xl m-auto p-4">
        <div className="flex flex-row space-x-4 my-4">
          <SelectSession
            stages={stages}
            currentStageId={currentStage.id}
          />
          {currentStage && (
            <RecordingSelect
              selectedRecording={currentRecording ?? undefined}
              streamRecordings={stageRecordings.recordings}
            />
          )}
        </div>
        {currentRecording ? (
          <>
            <SessionContent
              selectedRecording={currentRecording}
              parentStream={
                stageRecordings.parentStream?.playbackId ?? ''
              }
            />
          </>
        ) : (
          <>No recordings found for this livestream</>
        )}
      </div>
    </div>
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
          <CardTitle>{stageName}</CardTitle>
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
