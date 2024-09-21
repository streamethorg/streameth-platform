import React, { Suspense } from 'react';
import { ClipsPageParams } from '@/lib/types';
import { fetchOrganization } from '@/lib/services/organizationService';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import ClipStartOptions from './components/clipOptions/ClipStartOptions';
import { fetchAllSessions } from '@/lib/data';
import ClippingInterface from './components/clippingInterface/ClippingInterface';
import { fetchSession } from '@/lib/services/sessionService';
import {
  fetchStage,
  fetchStageRecordings,
  fetchStages,
} from '@/lib/services/stageService';
import { getLiveStageSrcValue } from '@/lib/utils/utils';
import { StageType } from 'streameth-new-server/src/interfaces/stage.interface';
import { fetchMarkers } from '@/lib/services/clipSevice';

const ClipContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full w-full">
    <div className="mx-auto flex h-full w-full flex-row">{children}</div>
  </div>
);

const ClipsConfig = async ({ params, searchParams }: ClipsPageParams) => {
  const { videoType, sessionId, stageId } = searchParams;
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });
  if (!organization) return notFound();

  // get all recordings from sessions from the last 7 days (This might change if clipping engine can handle older recordings)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const sessionRecordings = (
    await fetchAllSessions({ organizationSlug: params.organization })
  )?.sessions?.filter(
    (session) =>
      session?.type === 'livestream' &&
      new Date(session?.createdAt as string) > sevenDaysAgo
  );

  // stages
  const stages = await fetchStages({
    organizationId: organization._id,
  });
  const customUrlStages = stages.filter(
    (stage) => stage?.type === StageType.custom
  );
  const liveStages = stages.filter((stage) => stage.streamSettings?.isActive);

  // if no videoType, render the ClipStartOptions component
  if (!videoType)
    return (
      <ClipContainer>
        <Card className="mx-auto bg-white shadow-none mb-auto flex h-auto w-full max-w-[500px] flex-col items-center space-y-4 p-4  mt-4">
          <ClipStartOptions
            pastRecordings={sessionRecordings}
            liveStages={liveStages}
            organizationId={organization._id}
            customUrlStages={customUrlStages}
          />
        </Card>
      </ClipContainer>
    );

  const markers = await fetchMarkers({
    organizationId: organization._id,
  });

  if (videoType === 'livestream' && stageId) {
    // Fetch live recording for the selected stage
    const liveStage = liveStages.find((stage) => stage._id === stageId);
    const streamId = liveStage?.streamSettings?.streamId;
    if (!streamId) return <div>live stage not found</div>;

    const stageRecordings = await fetchStageRecordings({ streamId });
    const liveRecording = stageRecordings?.recordings[0] ?? null;

    return (
      <ClipContainer>
        <ClippingInterface
          markers={markers}
          stages={stages}
          organizationId={organization._id}
          src={getLiveStageSrcValue({
            playbackId: liveRecording?.playbackId,
            recordingId: liveRecording?.id,
          })}
          type={'livepeer'}
        />
      </ClipContainer>
    );
  }

  // if videoType === 'recording' and sessionId is provided, render the ClippingInterface component
  if (videoType === 'recording' && sessionId) {
    const session = await fetchSession({
      session: sessionId,
    });
    if (!session || !session.videoUrl) return <div>No session found</div>;
    return (
      <ClipContainer>
        <ClippingInterface
          markers={markers}
          stages={stages}
          organizationId={organization._id}
          src={session?.videoUrl}
          type={'livepeer'}
        />
      </ClipContainer>
    );
  }

  if (videoType === 'customUrl' && stageId) {
    const stage = await fetchStage({
      stage: stageId,
    });
    if (!stage || !stage?.source?.m3u8Url) return <div>No stage found</div>;

    return (
      <ClipContainer>
        <ClippingInterface
          markers={markers}
          stages={stages}
          organizationId={organization._id}
          src={stage?.source?.m3u8Url}
          type={stage?.source?.type}
        />
      </ClipContainer>
    );
  }

  return <div>No or wrong videoType provided</div>;
};

// Renders the ClipsConfig component with a fallback skeleton
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

      {/*Skeleton Sidebar */}
      <div className="flex h-full w-1/3 flex-col border-l bg-background bg-white">
        <div className="h-[calc(100%-50px)] space-y-4 overflow-y-clip">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse p-4">
              <div className="aspect-video w-full rounded bg-gray-200 p-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <Suspense
      key={searchParams.videoType}
      fallback={searchParams.videoType ? <Skeleton2 /> : <Skeleton />}
    >
      <ClipsConfig params={params} searchParams={searchParams} />
    </Suspense>
  );
};
export default ClipsPage;
