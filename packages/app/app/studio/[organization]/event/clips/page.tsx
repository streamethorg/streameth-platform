import React from 'react'
import { notFound } from 'next/navigation'
import { ClipsPageParams } from '@/lib/types'
import { fetchAllSessions } from '@/lib/data'
import { fetchEvent } from '@/lib/services/eventService'
import { fetchStage } from '@/lib/services/stageService'
import { Livepeer } from 'livepeer'
import { Session, Stream } from 'livepeer/dist/models/components'
import NoSession from './components/NoSession'
import SessionList from './components/SessionList'
import PlayerWithControls from '@/components/ui/Player'
import RecordingSelect from './components/RecordingSelect'
import ClipStatus from './components/ClipStatus'
import { IExtendedSession as ISession } from '@/lib/types'
import TimeSetter from './components/TimeSetter'
import CreateClipButton from './components/CreateClipButton'
import { ClipProvider } from './components/ClipContext'
import ReactHlsPlayer from './components/Player'

const EventClips = async ({
  params,
  searchParams,
}: ClipsPageParams) => {
  const { eventId, stage, selectedSession, selectedRecording } =
    searchParams

  if (!eventId || !stage) {
    return notFound()
  }

  try {
    const livepeer = new Livepeer({
      apiKey: process.env.LIVEPEER_API_KEY,
    })
    const stageData = await fetchStage({ stage })

    if (!stageData) {
      return notFound()
    }

    const parentStream = (
      await livepeer.stream.get(
        stageData.streamSettings.streamId ?? ''
      )
    ).stream
    const recordings = (
      await livepeer.session.getRecorded(parentStream?.id ?? '')
    ).classes
    const sessions = (await fetchAllSessions({ stageId: stage }))
      .sessions
    const session = sessions.find((s) => s._id === selectedSession)
    const event = await fetchEvent({ eventId })

    if (!event || !parentStream || !parentStream.playbackId) {
      return notFound()
    }

    if (sessions.length === 0) {
      return (
        <NoSession
          stageId={stage}
          organization={event.organizationId as string}
          eventId={eventId}
        />
      )
    }

    const sessionContent =
      session && parentStream.playbackId ? (
        <SessionContent
          session={session}
          playbackId={parentStream.playbackId}
          recordings={recordings ?? []}
          selectedRecording={selectedRecording}
        />
      ) : (
        <SelectSessionMessage />
      )

    return (
      <div className="flex flex-row h-full gap-2">
        <SessionListSide
          sessions={sessions}
          eventId={eventId}
          organizationId={event.organizationId as string}
          stageId={stage}
        />
        {sessionContent}
      </div>
    )
  } catch (error) {
    console.error('Failed to load event clips:', error)
    return notFound()
  }
}

const SessionListSide = ({
  sessions,
  eventId,
  organizationId,
  stageId,
}: {
  sessions: ISession[]
  eventId: string
  organizationId: string
  stageId: string
}) => (
  <div className="flex flex-col w-2/6 border-none rounded-none overflow-auto h-full gap-2">
    <SessionList
      sessions={sessions}
      eventId={eventId}
      organizationId={organizationId}
      stageId={stageId}
    />
  </div>
)

const SessionContent = ({
  session,
  playbackId,
  recordings,
  selectedRecording,
}: {
  session: ISession
  playbackId: string
  recordings: Session[]
  selectedRecording: string
}) => (
  <div className="flex flex-col w-full h-full overflow-auto">
    <div className="px-2 space-y-2">
      {session.name}
      <div>
        <ClipProvider>
          <ReactHlsPlayer
            playbackId={playbackId}
            selectedStreamSession={selectedRecording}
          />
          <RecordingSelect
            streamRecordings={JSON.parse(JSON.stringify(recordings))}
          />
          <div className="flex flex-row w-full space-x-1 items-center">
            <TimeSetter label="Clip start" type="start" />
            <TimeSetter label="Clip end" type="end" />
            <CreateClipButton
              selectedRecording={selectedRecording}
              playbackId={playbackId}
              session={session}
            />
          </div>
        </ClipProvider>
      </div>
    </div>
  </div>
)

const SelectSessionMessage = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="text-2xl">Select a session</div>
  </div>
)

export default EventClips
