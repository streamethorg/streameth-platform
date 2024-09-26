import React from 'react';
import ReactHlsPlayer from './Player';
import ClipSlider from '../ClipSlider';
import { ClipProvider } from '../ClipContext';
import ClipSidebar from './ClipSidebar';

const ClippingInterface = ({ src, type }: { src: string; type: string }) => {
  console.log(src);
  return (
    <ClipProvider>
      <div className="flex w-full flex-col">
        <div className="flex h-full w-full flex-col space-y-4 overflow-auto bg-white p-4">
          <ReactHlsPlayer src={src} type={type} />
          <ClipSlider />
        </div>
      </div>

      <ClipSidebar />
    </ClipProvider>
  );
};

export default ClippingInterface;
