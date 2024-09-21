import React from 'react';
import ReactHlsPlayer from './Player';

import { ClipProvider } from '../ClipContext';
import ClipSidebar from './ClipSidebar';
import Controls from '../Controls';
import Timeline from '../Timeline';
import { IExtendedMarkers, IExtendedStage } from '@/lib/types';

const ClippingInterface = ({
  markers,
  stages,
  organizationId,
  src,
  type,
}: {
  src: string;
  type: string;
  organizationId: string;
  markers: IExtendedMarkers[];
  stages: IExtendedStage[];
}) => {
  return (
    <ClipProvider>
      <div className="flex w-full flex-col">
        <div className="flex h-full w-full flex-col space-y-4 overflow-auto bg-white p-4">
          <ReactHlsPlayer src={src} type={type} />
          <Controls />
          <Timeline />
        </div>
      </div>

      <ClipSidebar
        markers={markers}
        stages={stages}
        organizationId={organizationId}
      />
    </ClipProvider>
  );
};

export default ClippingInterface;
