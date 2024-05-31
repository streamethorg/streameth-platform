import React, { Suspense } from 'react'
import { ClipsPageParams, IExtendedSession } from '@/lib/types'
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
import Preview from '../Preview'
import ClipsSessionList from './components/ClipSessionList'
import { getAsset } from '@/lib/actions/livepeer'
import { fetchSession } from '@/lib/services/sessionService'
import { IExtendedEvent, IExtendedStage } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import EmptyFolder from '@/lib/svg/EmptyFolder'

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

const SkeletonSidebar = () => (
  <div className="w-1/3 flex flex-col h-full bg-background bg-white border-l">
    <CardTitle className="bg-white p-2 border-b text-lg">
      Livestream clips
    </CardTitle>
    <div className="h-[calc(100%-50px)] overflow-y-clip space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse p-4">
          <div className="aspect-video bg-gray-200 rounded w-full p-4"></div>
        </div>
      ))}
    </div>
  </div>
)

const SessionSidebar = async ({
  currentStage,
  event,
  sessions,
}: {
  currentStage: IExtendedStage
  event?: IExtendedEvent
  sessions: IExtendedSession[]
}) => {
  return (
    <div className="max-w-[300px] w-full h-full bg-background bg-white border-l">
      <CardTitle className="bg-white p-2 border-b text-lg">
        Livestream clips
      </CardTitle>
      <div className="h-[calc(100%-50px)] overflow-y-scroll">
        {sessions.length > 0 ? (
          <ClipsSessionList event={event} sessions={sessions} />
        ) : (
          <div className="flex flex-col justify-center items-center space-y-6 h-full">
            <EmptyFolder width={100} height={60} />
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold">
                No clips created yet
              </p>
              <p className=" text-gray-500">
                Upload your first video to get started!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
const EventClips = async ({
  params,
  searchParams,
}: ClipsPageParams) => {
  const { stage, selectedRecording, previewId } = searchParams

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  }

  const stages = await fetchStages({
    organizationId: organization._id,
  })

  if (stages.length === 0) {
    return (
      <ClipContainer>
        <div className="flex max-w-[500px] h-auto mx-auto mb-auto flex-col w-full p-4 items-center space-y-4">
          <div className="bg-white text-center max-w-[500px] space-y-4 w-full border rounded-lg p-4 mx-auto mb-auto flex bg-background flex-col justify-center items-center h-full">
            <Film className="p-4 rounded-lg" size={84} />
            <p className=" font-bold text-lg">Clip a livestream!</p>
            <p className="text-sm text-foreground-muted">
              You dont have any stages to clip from, first create a
              livestream to get started
            </p>
            <Link href={`/studio/${params.organization}/livestreams`}>
              <Button variant={'primary'}>Create a livestream</Button>
            </Link>
          </div>
        </div>
      </ClipContainer>
    )
  }

  const currentStage = stages.find((s) => {
    return s._id === stage
  })

  if (!currentStage) {
    return (
      <ClipContainer>
        <div className="flex max-w-[500px] h-auto mx-auto mb-auto flex-col w-full p-4 items-center space-y-4">
          <SelectSession stages={stages} currentStageId={stage} />
          <div className="bg-white text-center  space-y-2 w-full border rounded-lg p-4 mx-auto flex bg-background flex-col justify-center items-center h-full">
            <Film className="p-4 rounded-lg" size={84} />
            <p className=" font-bold text-lg">Clip a livestream!</p>
            <p className="text-sm text-foreground-muted">
              Please select a livestream that has a recordings from
              the dropdown above
            </p>
            <p className="font-bold">or</p>
            <Link href={`/studio/${params.organization}/livestreams`}>
              <Button variant={'primary'}>Create a livestream</Button>
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

  if (
    stageRecordings.recordings.length === 0 ||
    !stageRecordings?.parentStream?.id
  ) {
    return (
      <ClipContainer>
        <div className="flex flex-col w-full p-4 max-w-[500px] space-y-4 mx-auto mb-auto">
          <SelectSession stages={stages} currentStageId={stage} />
          <div className="text-center bg-white  space-y-2 w-full border rounded-lg p-8 mx-auto flex bg-background flex-col justify-center items-center h-full">
            <Film className="p-4 rounded-lg" size={84} />
            <p className=" font-bold text-lg">No recordings</p>
            <p className="text-sm text-foreground-muted">
              This stream does not have any recordings, go live and
              come back to clip to clip your livestream
            </p>
            <Link href={`/studio/${params.organization}/livestreams`}>
              <Button variant={'primary'}>Go Live</Button>
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
    stageId: currentStage._id,
  })

  const previewAsset = await (async function () {
    if (previewId) {
      const session = await fetchSession({
        session: previewId,
      })
      if (session) {
        return await getAsset(session.assetId as string)
      }
    }
    return undefined
  })()

  return (
    <ClipContainer>
      {previewAsset && (
        <Preview
          initialIsOpen={previewId !== ''}
          organizationId={organization._id as string}
          asset={previewAsset}
          sessionId={previewId}
          organizationSlug={params.organization}
        />
      )}
      <div className="flex flex-col w-full pt-2 px-8 ">
        {/* <div className="flex flex-row justify-center space-x-4 my-4 w-full">
          <SelectSession
            stages={stages}
            currentStageId={currentStage._id}
          />
          <RecordingSelect
            selectedRecording={currentRecording ?? undefined}
            streamRecordings={stageRecordings.recordings}
          />
        </div> */}
        <div className="flex flex-col w-full h-full overflow-auto space-y-4">
          <ClipProvider>
            <ReactHlsPlayer
              playbackId={
                stageRecordings.parentStream?.playbackId ?? ''
              }
              selectedStreamSession={currentRecording}
            />
            <div className="flex flex-col space-y-4">
              <Tabs defaultValue={'sessions'}>
                <TabsList className="border-y border-grey w-full !justify-start gap-5">
                  <TabsTrigger className="px-0" value="sessions">
                    Clip Session
                  </TabsTrigger>
                  <TabsTrigger value="custom">
                    Create Custom Clip
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="sessions">
                  <div className="flex flex-row w-full space-x-2 items-center justify-center">
                    <TimeSetter label="Clip start" type="start" />
                    <TimeSetter label="Clip end" type="end" />

                    <CreateClipButton
                      selectedRecording={currentRecording}
                      playbackId={
                        stageRecordings.parentStream?.playbackId ?? ''
                      }
                      stageId={currentStage?._id}
                      organizationId={organization._id as string}
                      sessions={sessions.sessions}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="custom">
                  <div className="flex flex-row w-full space-x-2 items-center justify-center">
                    <TimeSetter label="Clip start" type="start" />
                    <TimeSetter label="Clip end" type="end" />

                    <CreateClipButton
                      selectedRecording={currentRecording}
                      playbackId={
                        stageRecordings.parentStream?.playbackId ?? ''
                      }
                      stageId={currentStage?._id}
                      organizationId={organization._id as string}
                      sessions={sessions.sessions}
                      custom
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ClipProvider>
        </div>
      </div>
      <Suspense key={currentStage._id} fallback={<SkeletonSidebar />}>
        <SessionSidebar
          currentStage={currentStage}
          event={event ?? undefined}
          sessions={sessions.sessions.filter(
            (session) => session.assetId
          )}
        />
      </Suspense>
    </ClipContainer>
  )
}

const ClipsPage = async ({
  params,
  searchParams,
}: ClipsPageParams) => {
  const Skeleton = () => (
    <div className="flex flex-col w-full p-4 max-w-[500px] space-y-4 mx-auto mb-auto">
      {/* SelectSession Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>

      {/* Main Content Skeleton */}
      <div className="animate-pulse">
        <div className="text-center bg-white space-y-2 w-full border rounded-lg p-8 mx-auto flex bg-background flex-col justify-center items-center h-full">
          <div className="p-4 rounded-lg bg-gray-200 w-16 h-16"></div>
          <div className="font-bold text-lg h-6 bg-gray-200 w-32 rounded"></div>
          <div className="text-sm text-foreground-muted">
            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-200 w-4/5 rounded"></div>
            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 w-32 rounded"></div>
        </div>
      </div>
    </div>
  )

  const Skeleton2 = () => (
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full p-8 ">
        <div className="flex flex-row justify-center space-x-4 my-4 w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-xl w-full"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-xl w-full"></div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full overflow-auto space-y-4">
          <div className="animate-pulse">
            <div className=" aspect-video w-full bg-gray-200 rounded"></div>
          </div>
          {/* Clip Control Loading State */}
          <div className="animate-pulse">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row w-full space-x-2 items-center justify-center">
                <div className="h-8 bg-gray-200 rounded-xl w-full"></div>
                <div className="h-8 bg-gray-200 rounded-xl w-full"></div>
                <div className="h-8 bg-gray-200 rounded-xl w-full"></div>
                <div className="h-8 bg-gray-200 rounded-xl w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SkeletonSidebar />
    </div>
  )
  return (
    <Suspense
      key={searchParams.stage + searchParams.selectedRecording}
      fallback={
        searchParams.stage && searchParams.selectedRecording ? (
          <Skeleton2 />
        ) : (
          <Skeleton />
        )
      }>
      <EventClips params={params} searchParams={searchParams} />
    </Suspense>
  )
}

export default ClipsPage
