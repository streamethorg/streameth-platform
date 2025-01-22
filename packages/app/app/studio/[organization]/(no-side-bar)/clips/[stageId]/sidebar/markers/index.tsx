'use client';
import React, { useState, useMemo } from 'react';
import { CardTitle } from '@/components/ui/card';
import Marker from './Marker';
import { IExtendedMarker } from '@/lib/types';
import { useMarkersContext } from './markersContext';
import { extractHighlightsAction } from '@/lib/actions/sessions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useClipContext } from '../../ClipContext';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TranscriptionStatus } from 'streameth-new-server/src/interfaces/state.interface';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';

const Markers = ({
  sessionId,
  transcribeStatus,
  aiAnalysisStatus,
}: {
  sessionId: string;
  transcribeStatus: TranscriptionStatus | null;
  aiAnalysisStatus: ProcessingStatus | null;
}) => {
  const { isLoadingMarkers, markers, organizationId, fetchAndSetMarkers } =
    useMarkersContext();

  const [prompt, setPrompt] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const handleExtractHighlights = async () => {
    if (transcribeStatus !== 'completed') {
      toast.error('Please transcribe the video first');
      return;
    }
    setIsExtracting(true);

    extractHighlightsAction({
      sessionId: sessionId,
      prompt: prompt,
    })
      .then((res) => {
        fetchAndSetMarkers();
        setIsExtracting(false);
      })
      .catch((err) => {
        toast.error('Failed to extract highlights');
        setIsExtracting(false);
      });
  };

  if (isLoadingMarkers) {
    return (
      <div className="flex h-full w-full flex-col border-l bg-background bg-white">
        <div className="h-[calc(100%-50px)] space-y-4 overflow-y-clip">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse p-4">
              <div className="aspect-video w-full rounded bg-gray-200 p-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (markers.length === 0) {
    return (
      <div className="w-full bg-white p-4 space-y-4 text-lg flex-shrink-0">
        <p className="text-lg font-bold">AI video analysis</p>
        <p className="text-sm">
          Use AI to identify key moments in your video to create clips from.
        </p>
        <div className=" space-y-2">
          <Badge
            variant="default"
            className="text-sm hover:cursor-pointer hover:bg-gray-100 w-auto"
            onClick={() =>
              setPrompt('Extract all talk and panels from this video')
            }
          >
            &quot;Extract all talk and panels from this video&quot;
          </Badge>
          <Badge
            variant="default"
            className="text-sm hover:cursor-pointer hover:bg-gray-100"
            onClick={() =>
              setPrompt('Extract key moments for short form content')
            }
          >
            &quot;Extract key moments for short form content&quot;
          </Badge>
        </div>
        <Textarea
          placeholder="Prompt for highlights"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        {isExtracting ? (
          <Button disabled>Extracting...</Button>
        ) : (
          <Button
            className="w-full"
            variant="primary"
            disabled={prompt.length === 0}
            onClick={() => {
              handleExtractHighlights();
            }}
          >
            Extract Highlights
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-full border-l flex flex-col">
      <CardTitle className="w-full border-b bg-white p-2 space-y-2 text-lg flex-shrink-0">
        <div className=" space-y-2">
          <Badge
            variant="default"
            className="text-sm hover:cursor-pointer hover:bg-gray-100 w-auto"
            onClick={() =>
              setPrompt('Extract all talk and panels from this video')
            }
          >
            &quot;Extract all talk and panels from this video&quot;
          </Badge>
          <Badge
            variant="default"
            className="text-sm hover:cursor-pointer hover:bg-gray-100"
            onClick={() =>
              setPrompt('Extract key moments for short form content')
            }
          >
            &quot;Extract key moments for short form content&quot;
          </Badge>
        </div>
        <Textarea
          placeholder="Prompt for highlights"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        {isExtracting ? (
          <Button disabled>Extracting...</Button>
        ) : (
          <Button
            className="w-full"
            variant="primary"
            onClick={() => {
              handleExtractHighlights();
            }}
          >
            Extract Highlights
          </Button>
        )}
      </CardTitle>
      <div className="flex-grow overflow-y-auto pb-4">
        {markers.length > 0 ? (
          markers.map((marker: IExtendedMarker) => (
            <div key={marker._id} className="w-full px-4 py-2">
              <Marker marker={marker} organizationId={organizationId} />
            </div>
          ))
        ) : (
          <div className="flex h-full mt-10 justify-center text-gray-500">
            No marker found
          </div>
        )}
      </div>
    </div>
  );
};

export default Markers;
