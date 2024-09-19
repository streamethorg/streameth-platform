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
import ClipSlider from './components/ClipSlider';
import SessionRecordingSelect from './components/SessionRecordingSelect';
import InjectUrlInput from './components/InjectUrlInput';
import Markers from './components/markers/Markers';
import { fetchMarkers } from '@/lib/services/clipSevice';

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
  const { stage, selectedRecording, type, previewId } = searchParams;

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) {
    return notFound();
  }

  // stages
  const stages = await fetchStages({
    organizationId: organization._id,
  });

  const activeStages = stages.filter((stage) => stage.streamSettings?.isActive);

  // Fetch recordings for each active stage
  const stageRecordingsPromises = activeStages.map(async (stage) => {
    const streamId = stage?.streamSettings?.streamId ?? '';
    if (streamId) {
      return await fetchStageRecordings({ streamId });
    }
    return null;
  });

  // Wait for all recordings to be fetched
  const stageRecordings = await Promise.all(stageRecordingsPromises);
  // Create a new array with parentStream name and the first(live) recording
  const liveStageRecordings = stageRecordings.map((recording, index) => {
    const firstRecording = recording?.recordings[0] || null; // Get the first recording, or null if there are no recordings
    return {
      parentStreamName: recording?.parentStream?.name || 'Unknown', // Use stage's name or 'Unknown' if not present
      firstRecording,
    };
  });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const sessionRecordings = (
    await fetchAllSessions({ organizationSlug: params.organization })
  )?.sessions?.filter(
    (session) =>
      session?.type === 'livestream' &&
      new Date(session?.createdAt as string) > sevenDaysAgo
  );

  if (!selectedRecording) {
    return (
      <ClipContainer>
        <div className="mx-auto mb-auto flex h-auto w-full max-w-[500px] flex-col items-center space-y-4 p-4  mt-4">
          <div className="flex flex-col space-y-4 bg-white">
            {liveStageRecordings.length > 0 && (
              <SelectSession
                stages={liveStageRecordings}
                currentStageId={stage}
              />
            )}
          </div>
          <SessionRecordingSelect sessions={sessionRecordings} />
          <InjectUrlInput organizationId={organization._id} />
        </div>
      </ClipContainer>
    );
  }

  const markers = await fetchMarkers({
    organizationId: organization._id,
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
      <ClipProvider>
        <div className="flex w-full flex-col">
          <div className="flex h-full w-full flex-col space-y-4 overflow-auto bg-white p-4">
            <ReactHlsPlayer src={selectedRecording} type={type} />
            <ClipSlider />
            {/* <CreateClipButton
              currentRecording={currentRecording}
              playbackId={stageRecordings.parentStream?.playbackId ?? ''}
              organization={organization}
              currentStage={currentStage}
              sessions={sessions}
            /> */}
          </div>
        </div>

        <Suspense fallback={<SkeletonSidebar />}>
          <SessionSidebar
            stages={stages}
            markers={markers}
            organizationId={organization._id}
            sessions={sessionRecordings.filter((session) => session.assetId)}
            currentRecording={selectedRecording}
          />
        </Suspense>
      </ClipProvider>
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
      key={searchParams.selectedRecording}
      fallback={searchParams.selectedRecording ? <Skeleton2 /> : <Skeleton />}
    >
      <EventClips params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default ClipsPage;
