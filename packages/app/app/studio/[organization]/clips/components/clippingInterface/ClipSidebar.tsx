'use client';

import React from 'react';
import Markers from '../markers/Markers';
import { IExtendedMarkers, IExtendedStage } from '@/lib/types';

const ClipSidebar = ({
  markers,
  organizationId,
  stages,
}: {
  stages: IExtendedStage[];
  markers?: IExtendedMarkers[];
  currentRecording?: string;
  organizationId: string;
}) => {
  return (
    <div className="h-full w-[500px] px-2 border-l bg-background bg-white">
      <Markers
        stages={stages}
        organizationId={organizationId}
        organizationMarkers={markers}
      />
    </div>
  );
};

export default ClipSidebar;
