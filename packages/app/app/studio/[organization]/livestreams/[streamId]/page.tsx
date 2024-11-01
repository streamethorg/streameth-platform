'use server';

import React from 'react';
import { fetchStage } from '@/lib/services/stageService';
import { LivestreamPageParams } from '@/lib/types';
import StreamHeader from './components/StreamHeader';
import NotFound from '@/app/not-found';
import { fetchOrganization } from '@/lib/services/organizationService';
import { fetchAllSessions } from '@/lib/services/sessionService';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import StageControls from './components/StageControls';

const Livestream = async ({ params }: LivestreamPageParams) => {
  if (!params.streamId) return null;

  const stream = await fetchStage({ stage: params.streamId });
  const organization = await fetchOrganization({
    organizationId: params.organization,
  });

  if (!stream || !organization) {
    return NotFound();
  }

  const stageSessions = (
    await fetchAllSessions({
      stageId: stream._id?.toString(),
      type: SessionType.clip,
      onlyVideos: true,
    })
  ).sessions;

  return (
    <div className="flex flex-col p-4 w-full h-full max-h-screen max-w-screen-3xl">
      <StreamHeader
        organizationSlug={params.organization}
        stream={stream}
        isLiveStreamPage
      />
      <StageControls
        organization={organization}
        stream={stream}
        stageSessions={stageSessions}
      />
    </div>
  );
};

export default Livestream;
