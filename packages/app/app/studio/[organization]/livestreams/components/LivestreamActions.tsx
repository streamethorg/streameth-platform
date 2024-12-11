'use client';
import { IExtendedStage } from '@/lib/types';
import React from 'react';
import ShareLivestream from './ShareLivestream';
import DeleteLivestream from './DeleteLivestream';
import EditLivestream from './EditLivestream';
import LivestreamVisibility from './ToggleLivestreamVisibility';

const LivestreamActions = ({
  stream,
  organizationSlug,
}: {
  stream: IExtendedStage;
  organizationSlug: string;
}) => {
  return (
    <div className="space-y-2 w-40">
      <LivestreamVisibility stream={stream} />
      <EditLivestream organizationSlug={organizationSlug} stage={stream} />
      <ShareLivestream organization={organizationSlug} streamId={stream._id!} />
      <DeleteLivestream stream={stream} />
    </div>
  );
};

export default LivestreamActions;
