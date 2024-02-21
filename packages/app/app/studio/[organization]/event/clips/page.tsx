import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ClipsPageParams } from '@/lib/types'
import { fetchAllSessions } from '@/lib/data'
import { fetchEvent } from '@/lib/services/eventService'
import { fetchStage } from '@/lib/services/stageService'
import { Livepeer } from 'livepeer'
import NoSession from './components/NoSession'
import SessionList from './components/SessionList'
import RecordingSelect from './components/RecordingSelect'
import { IExtendedSession as ISession } from '@/lib/types'
import TimeSetter from './components/TimeSetter'
import CreateClipButton from './components/CreateClipButton'
import { ClipProvider } from './components/ClipContext'
import ReactHlsPlayer from './components/Player'
import Preview from './components/Preview'
import { Asset } from 'livepeer/dist/models/components'

const EventClips = async ({
  params,
  searchParams,
}: ClipsPageParams) => {
  const {
    eventId,
    stage,
    selectedSession,
    selectedRecording,
    replaceAsset,
  } = searchParams

  if (!eventId || !stage) {
    return notFound()
  }

  try {
    const stageData = await fetchStage({ stage })
    if (!stageData) {
      return notFound()
    }

    const sessions = (await fetchAllSessions({ stageId: stage }))
      .sessions
    const session = sessions.find((s) => s._id === selectedSession)
    const event = await fetchEvent({ eventId })

    if (!event) {
      return notFound()
    }

    if (sessions.length === 0) {
      return (
        <NoSession
          stageId={stage}
          organization={params.organization}
          eventId={eventId}
        />
      )
    }

    const sessionContent =
      session &&
      selectedSession &&
      stageData.streamSettings.streamId ? (
        <Suspense
          key={selectedSession + selectedRecording}
          fallback={<div className="w-full">loading</div>}>
          <SessionContent
            session={session}
            selectedRecording={selectedRecording}
            replaceAsset={replaceAsset}
            streamId={stageData.streamSettings.streamId}
          />
        </Suspense>
      ) : (
        <SelectSessionMessage />
      )

    return (
      <div className="flex flex-row h-full gap-2 p-4">
        <div className="w-2/6 h-full">
          <SessionList
            organizationSlug={params.organization}
            sessions={sessions}
            eventId={eventId}
            organizationId={event.organizationId as string}
            stageId={stage}
          />
        </div>
        {sessionContent}
      </div>
    )
  } catch (error) {
    console.error('Failed to load event clips:', error)
    return notFound()
  }
}

const SessionContent = async ({
  session,
  selectedRecording,
  replaceAsset,
  streamId,
}: {
  session: ISession
  selectedRecording: string
  replaceAsset?: string
  streamId: string
}) => {
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })
  const parentStream = (await livepeer.stream.get(streamId)).stream

  const recordings = (
    await livepeer.session.getRecorded(parentStream?.id ?? '')
  ).classes

  let asset: Asset | undefined

  if (session?.assetId) {
    asset = (await livepeer.asset.get(session?.assetId ?? '')).asset
  }

  return (
    <div className="flex flex-col w-full h-full overflow-auto space-y-2">
      <h3>{session.name}</h3>
      {asset && !replaceAsset ? (
        <Preview
          playbackUrl={asset?.playbackUrl}
          phase={asset.status?.phase}
          progress={asset.status?.progress}
        />
      ) : (
        <ClipProvider>
          <ReactHlsPlayer
            playbackId={parentStream?.playbackId ?? ''}
            selectedStreamSession={
              selectedRecording ?? recordings?.[0]?.id
            }
          />
          <RecordingSelect
            selectedRecording={
              selectedRecording ?? recordings?.[0]?.id
            }
            streamRecordings={JSON.parse(JSON.stringify(recordings))}
          />
          <div className="flex flex-row w-full space-x-1 items-center justify-center">
            <TimeSetter label="Clip start" type="start" />
            <TimeSetter label="Clip end" type="end" />
            <CreateClipButton
              selectedRecording={
                selectedRecording ?? recordings?.[0]?.id
              }
              playbackId={parentStream?.playbackId ?? ''}
              session={session}
            />
          </div>
        </ClipProvider>
      )}
    </div>
  )
}

const SelectSessionMessage = () => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <div className="text-2xl">Select a session</div>
  </div>
)

export default EventClips
