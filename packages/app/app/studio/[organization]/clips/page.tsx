import React, { Suspense } from 'react';
import { ClipsPageParams } from '@/lib/types';
import SelectSession from './components/SelectSession';
import RecordingSelect from './components/RecordingSelect';
import CreateClipButton from './components/CreateClipButton';
import { ClipProvider } from './components/ClipContext';
import ReactHlsPlayer from './components/Player';
import { fetchStageRecordings, fetchStages } from '@/lib/services/stageService';
import { fetchAllSessions } from '@/lib/data';
import { fetchEvent } from '@/lib/services/eventService';
import { Film } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Preview from '../Preview';
import SessionSidebar from './components/SessionSidebar';
import { fetchAsset, fetchSession } from '@/lib/services/sessionService';
import { fetchOrganization } from '@/lib/services/organizationService';
import { notFound } from 'next/navigation';
import Timeline from './components/Timeline';
import Controls from './components/Controls';

const ClipContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full w-full">
    <div className="mx-auto flex h-full w-full flex-row">{children}</div>
  </div>
);

const SkeletonSidebar = () => (
  <div className="flex h-full w-1/3 flex-col border-l bg-background bg-white">
    <div className="h-[calc(100%-50px)] space-y-4 overflow-y-clip">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse p-4">
          <div className="aspect-video w-full rounded bg-gray-200 p-4"></div>
        </div>
      ))}
    </div>
  </div>
);

const EventClips = async ({ params, searchParams }: ClipsPageParams) => {
  const { stage, selectedRecording, previewId } = searchParams;

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) {
    return notFound();
  }

  const stages = await fetchStages({
    organizationId: organization._id,
  });

  if (stages.length === 0) {
    return (
      <ClipContainer>
        <div className="mx-auto mb-auto flex h-auto w-full max-w-[500px] flex-col items-center space-y-4 p-4">
          <div className="mx-auto mb-auto flex h-full w-full max-w-[500px] flex-col items-center justify-center space-y-4 rounded-lg border bg-background bg-white p-4 text-center">
            <Film className="rounded-lg p-4" size={84} />
            <p className="text-lg font-bold">Clip a livestream!</p>
            <p className="text-foreground-muted text-sm">
              You dont have any stages to clip from, first create a livestream
              to get started
            </p>
            <Link href={`/studio/${params.organization}/livestreams`}>
              <Button variant={'primary'}>Create a livestream</Button>
            </Link>
          </div>
        </div>
      </ClipContainer>
    );
  }

  const currentStage = stages.find((s) => {
    return s._id === stage;
  });

  if (!currentStage) {
    return (
      <ClipContainer>
        <div className="mx-auto mb-auto flex h-auto w-full max-w-[500px] flex-col items-center space-y-4 p-4">
          <SelectSession stages={stages} currentStageId={stage} />
          <div className="mx-auto flex h-full w-full flex-col items-center justify-center space-y-2 rounded-lg border bg-background bg-white p-4 text-center">
            <Film className="rounded-lg p-4" size={84} />
            <p className="text-lg font-bold">Clip a livestream!</p>
            <p className="text-foreground-muted text-sm">
              Please select a livestream that has a recordings from the dropdown
              above
            </p>
            <p className="font-bold">or</p>
            <Link href={`/studio/${params.organization}/livestreams`}>
              <Button variant={'primary'}>Create a livestream</Button>
            </Link>
          </div>
        </div>
      </ClipContainer>
    );
  }

  const stageRecordings = await fetchStageRecordings({
    streamId: currentStage?.streamSettings?.streamId ?? '',
  });

  const currentRecording = (function () {
    if (selectedRecording) {
      const recording = stageRecordings?.recordings.find(
        (recording) => recording?.id === selectedRecording
      );
      if (recording) {
        return recording?.id ?? null;
      }
      return null;
    }
    return null;
  })();

  if (
    stageRecordings?.recordings?.length === 0 ||
    !stageRecordings?.parentStream?.id
  ) {
    return (
      <ClipContainer>
        <div className="mx-auto mb-auto flex w-full max-w-[500px] flex-col space-y-4 p-4">
          <SelectSession stages={stages} currentStageId={stage} />
          <div className="mx-auto flex h-full w-full flex-col items-center justify-center space-y-2 rounded-lg border bg-background bg-white p-8 text-center">
            <Film className="rounded-lg p-4" size={84} />
            <p className="text-lg font-bold">No recordings</p>
            <p className="text-foreground-muted text-sm">
              This stream does not have any recordings, go live and come back to
              clip to clip your livestream
            </p>
            <Link href={`/studio/${params.organization}/livestreams`}>
              <Button variant={'primary'}>Go Live</Button>
            </Link>
          </div>
        </div>
      </ClipContainer>
    );
  }

  if (!currentRecording) {
    return (
      <ClipContainer>
        <div className="mx-auto mb-auto flex w-full max-w-[500px] flex-col space-y-4 p-4">
          <SelectSession stages={stages} currentStageId={stage} />
          <RecordingSelect streamRecordings={stageRecordings.recordings} />
          <div className="mx-auto flex h-full w-full flex-col items-center justify-center space-y-2 rounded-lg border bg-background bg-white p-4 text-center">
            <Film className="rounded-lg p-4" size={84} />
            <p className="text-lg font-bold">Clip a livestream!</p>
            <p className="text-foreground-muted text-sm">
              Please select a livestream recording from the dropdown above
            </p>
          </div>
        </div>
      </ClipContainer>
    );
  }

  const event = await fetchEvent({
    eventId: currentStage.eventId as string,
  });
  const sessions = await fetchAllSessions({
    stageId: currentStage._id,
  });
  const previewAsset = await (async function () {
    if (previewId) {
      const session = await fetchSession({
        session: previewId,
      });
      if (session) {
        return await fetchAsset({
          assetId: session.assetId as string,
        });
      }
    }
    return undefined;
  })();

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
      <div className="flex w-[calc(100%-400px)] flex-col">
        <div className="flex h-full w-full  flex-col">
          <ClipProvider>
            <div className="h-[80px] w-full bg-gray-100"></div>
            <ReactHlsPlayer
              playbackId={stageRecordings.parentStream?.playbackId ?? ''}
              selectedStreamSession={currentRecording}
            />
            <Controls />
            <Timeline />
            {/* <CreateClipButton
              currentRecording={currentRecording}
              playbackId={stageRecordings.parentStream?.playbackId ?? ''}
              organization={organization}
              currentStage={currentStage}
              sessions={sessions}
            /> */}
          </ClipProvider>
        </div>
      </div>
      <Suspense key={currentStage._id} fallback={<SkeletonSidebar />}>
        <SessionSidebar
          event={event ?? undefined}
          sessions={sessions.sessions.filter((session) => session.assetId)}
          currentRecording={currentRecording}
          recordings={stageRecordings}
        />
      </Suspense>
    </ClipContainer>
  );
};

const ClipsPage = async ({ params, searchParams }: ClipsPageParams) => {
  const Skeleton = () => (
    <div className="mx-auto mb-auto flex w-full max-w-[500px] flex-col space-y-4 p-4">
      {/* SelectSession Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 rounded bg-gray-200"></div>
      </div>

      {/* Main Content Skeleton */}
      <div className="animate-pulse">
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center space-y-2 rounded-lg border bg-background bg-white p-8 text-center">
          <div className="h-16 w-16 rounded-lg bg-gray-200 p-4"></div>
          <div className="h-6 w-32 rounded bg-gray-200 text-lg font-bold"></div>
          <div className="text-foreground-muted text-sm">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-4/5 rounded bg-gray-200"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          </div>
          <div className="h-10 w-32 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );

  const Skeleton2 = () => (
    <div className="flex w-full flex-row">
      <div className="flex w-full flex-col p-8">
        <div className="my-4 flex w-full flex-row justify-center space-x-4">
          <div className="animate-pulse">
            <div className="h-8 w-full rounded-xl bg-gray-200"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-8 w-full rounded-xl bg-gray-200"></div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col space-y-4 overflow-auto">
          <div className="animate-pulse">
            <div className="aspect-video w-full rounded bg-gray-200"></div>
          </div>
          {/* Clip Control Loading State */}
          <div className="animate-pulse">
            <div className="flex flex-col space-y-4">
              <div className="flex w-full flex-row items-center justify-center space-x-2">
                <div className="h-8 w-full rounded-xl bg-gray-200"></div>
                <div className="h-8 w-full rounded-xl bg-gray-200"></div>
                <div className="h-8 w-full rounded-xl bg-gray-200"></div>
                <div className="h-8 w-full rounded-xl bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SkeletonSidebar />
    </div>
  );
  return (
    <Suspense
      key={searchParams.stage + searchParams.selectedRecording}
      fallback={
        searchParams.stage && searchParams.selectedRecording ? (
          <Skeleton2 />
        ) : (
          <Skeleton />
        )
      }
    >
      <EventClips params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default ClipsPage;
