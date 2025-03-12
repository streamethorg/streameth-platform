'use server';

import React from 'react';
import { fetchStage } from '@/lib/services/stageService';
import { LivestreamPageParams } from '@/lib/types';
import StreamHeader from './components/StreamHeader';
import NotFound from '@/app/not-found';
import StageControls from './components/StageControls';
import Sidebar from './components/Sidebar';
import { fetchOrganization } from '@/lib/services/organizationService';
import { redirect } from 'next/navigation';

const Livestream = async ({ params }: LivestreamPageParams) => {
  if (!params.streamId) return NotFound();

  // Check if the organization has livestreaming permission (not on free tier)
  const organization = await fetchOrganization({
    organizationId: params.organization,
  });

  // Free tier users cannot access livestreaming features
  const isFree = organization?.subscriptionTier === 'free';
  if (isFree) {
    // Redirect to the livestreams list page with a URL parameter to show an upgrade message
    return redirect(`/studio/${params.organization}/livestreams?blockedAccess=true`);
  }

  const stream = await fetchStage({ stage: params.streamId });
  
  if (!stream) return NotFound();

  return (
    <div className="flex flex-col p-4 w-full h-full max-h-screen max-w-screen-3xl">
      <div className="flex flex-row flex-grow space-x-4 w-full">
        <div className="flex flex-col w-2/3">
          <StreamHeader stream={stream} isLiveStreamPage />
          <StageControls stream={stream} />
        </div>
        <div className="flex flex-col w-1/3">
          <Sidebar stage={stream} />
        </div>
      </div>
    </div>
  );
};

export default Livestream;
