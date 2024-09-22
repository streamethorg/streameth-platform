'use client';

import React from 'react';
import Markers from './markers/Markers';
import { IExtendedMarkers } from '@/lib/types';

const ClipSidebar = ({
  markers,
  organizationId,
  stageId,
}: {
  stageId: string;
  markers: IExtendedMarkers[];
  currentRecording?: string;
  organizationId: string;
}) => {
  return (
    <Markers
      markers={markers}
      stageId={stageId}
      organizationId={organizationId}
    />
  );
};

export default ClipSidebar;
