import React, { Suspense } from 'react';
import { ClipsPageParams } from '@/lib/types';
import { fetchOrganization } from '@/lib/services/organizationService';
import { notFound } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui/card';
import { fetchAllSessions } from '@/lib/data';
import { fetchStages } from '@/lib/services/stageService';
import { StageType } from 'streameth-new-server/src/interfaces/stage.interface';
import Link from 'next/link';

/*

    whats missing: 

    - create tables in the style of the library and the stream page for better ui.
    

*/
const ClipContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full w-full">
    <div className="mx-auto flex h-full w-full flex-row">{children}</div>
  </div>
);

const ClipsConfig = async ({ params, searchParams }: ClipsPageParams) => {
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

  return (
    <ClipContainer>
      <Card className="mx-auto bg-white shadow-none mb-auto flex h-auto w-full max-w-[500px] flex-col items-center space-y-4 p-4  mt-4">
        <CardTitle className="text-2xl font-bold">Past recordings</CardTitle>
        {sessionRecordings?.map((session) => (
          <Link
            key={session._id}
            href={`/studio/${organization.slug}/clips/${session.stageId}?sessionId=${session._id}&videoType=recording`}
          >
            {session.name}
          </Link>
        ))}

        {sessionRecordings?.length === 0 && (
          <div className="text-gray-500 text-sm">
            No past recordings from the last 7 days
          </div>
        )}
      </Card>

      <Card className="mx-auto bg-white shadow-none mb-auto flex h-auto w-full max-w-[500px] flex-col items-center space-y-4 p-4  mt-4">
        <CardTitle className="text-2xl font-bold">Custom</CardTitle>
        {customUrlStages?.map((stage) => (
          <Link
            key={stage._id}
            href={`/studio/${organization.slug}/clips/${stage._id}?videoType=customUrl`}
          >
            {stage.name}
          </Link>
        ))}

        {sessionRecordings?.length === 0 && (
          <div className="text-gray-500 text-sm">
            No past recordings from the last 7 days
          </div>
        )}
      </Card>

      <Card className="mx-auto bg-white shadow-none mb-auto flex h-auto w-full max-w-[500px] flex-col items-center space-y-4 p-4  mt-4">
        <CardTitle className="text-2xl font-bold">Active livestreams</CardTitle>
        {liveStages?.map((stage) => (
          <Link
            key={stage._id}
            href={`/studio/${organization.slug}/clips/${stage._id}?videoType=livestream`}
          >
            {stage.name}
          </Link>
        ))}
      </Card>
    </ClipContainer>
  );
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
