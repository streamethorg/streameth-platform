import React from 'react';
import ReactHlsPlayer from './Player';
import { ClipProvider } from '../ClipContext';
import ClipSidebar from './ClipSidebar';
import Controls from '../Controls';
import Timeline from '../Timeline';
import { fetchMarkers } from '@/lib/services/markerSevice';

const ClippingInterface = async ({
  organizationId,
  src,
  type,
  stageId,
}: {
  src: string;
  type: string;
  organizationId: string;
  stageId: string;
}) => {
  const markers = await fetchMarkers({
    organizationId,
    stageId,
  });

  return (
    <ClipProvider>
      <div className="flex h-full w-full flex-col space-y-4 overflow-auto bg-white p-4">
        <ReactHlsPlayer src={src} type={type} />
        <Controls />
        <Timeline markers={markers} />
      </div>
      <div className="h-full w-[500px] px-2 border-l bg-background bg-white">
        <ClipSidebar
          markers={markers}
          organizationId={organizationId}
          stageId={stageId}
        />
      </div>
    </ClipProvider>
  );
};

export default ClippingInterface;
