import React from 'react';
import ReactHlsPlayer from './Player';
import { ClipProvider } from '../ClipContext';
import Controls from '../Controls';
import Timeline from '../Timeline';
import { IExtendedMarkers, IExtendedStage } from '@/lib/types';
import Sidebar from '../sidebar';
const ClippingInterface = ({
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
  return (
    <ClipProvider>
      <div className="flex flex-row w-full h-full">
        <div className="flex h-full w-[calc(100%-400px)] flex-col">
          <div className="h-[80px] w-full bg-gray-100"></div>
          <ReactHlsPlayer src={src} type={type} />
          <Controls />
          <Timeline />
          {/* <CreateClipButton
                currentRecording={currentRecording}
                playbackId={stageRecordings.parentStream?.playbackId ?? ''}
                organization={organization}
                currentStage={currentStage}
                sessions={sessions}
              /> */}
        </div>
        <div className="flex w-[400px] h-full">
          <Sidebar organizationId={organizationId} />
        </div>
      </div>
    </ClipProvider>
  );
};

export default ClippingInterface;
