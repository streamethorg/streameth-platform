'use client';
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import Marker from './Marker';
import { IExtendedMarker } from '@/lib/types';
import { useMarkersContext } from './markersContext';
import { TranscriptionStatus } from 'streameth-new-server/src/interfaces/state.interface';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import { ExtractHighlightsForm } from './ExtractHighlightsForm';

const LoadingSkeleton = () => (
  <div className="flex h-full w-full flex-col border-l bg-background bg-white">
    <div className="h-[calc(100%-50px)] space-y-4 overflow-y-clip">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse p-4">
          <div className="aspect-video w-full rounded bg-gray-200 p-4" />
        </div>
      ))}
    </div>
  </div>
);

const MarkersList = ({
  markers,
}: {
  markers: IExtendedMarker[];
}) => (
  <div className="flex-grow overflow-y-auto pb-4">
    {markers.length > 0 ? (
      markers.map((marker: IExtendedMarker) => (
        <div key={marker._id} className="w-full px-4 py-2">
          <Marker marker={marker} />
        </div>
      ))
    ) : (
      <div className="flex h-full mt-10 justify-center text-gray-500">
        No marker found
      </div>
    )}
  </div>
);

const Markers = ({
  transcribeStatus,
  aiAnalysisStatus,
}: {
  transcribeStatus: TranscriptionStatus | null;
  aiAnalysisStatus: ProcessingStatus | null;
}) => {
  const { isLoadingMarkers, markers } = useMarkersContext();

  if (isLoadingMarkers) {
    return <LoadingSkeleton />;
  }

  if (markers.length === 0) {
    return (
      <div className="w-full bg-white p-4 space-y-4 text-lg flex-shrink-0">
        <p className="text-lg font-bold">AI video analysis</p>
        <p className="text-sm">
          Use AI to identify key moments in your video to create clips from.
        </p>
        <ExtractHighlightsForm
          transcribeStatus={transcribeStatus}
          aiAnalysisStatus={aiAnalysisStatus}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full border-l flex flex-col">
      <CardTitle className="w-full border-b bg-white p-2 space-y-2 text-lg flex-shrink-0">
        <ExtractHighlightsForm
          transcribeStatus={transcribeStatus}
          aiAnalysisStatus={aiAnalysisStatus}
        />
      </CardTitle>
      <MarkersList markers={markers} />
    </div>
  );
};

export default Markers;
