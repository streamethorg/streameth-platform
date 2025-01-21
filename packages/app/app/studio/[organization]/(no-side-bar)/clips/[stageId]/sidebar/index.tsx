'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Markers from './markers/index';
import SessionSidebar from './clips';
import { useClipContext } from '../ClipContext';
import AddOrEditMarkerForm from './markers/AddOrEditMarkerForm';
import ImportMarkersForm from './markers/ImportMarkersForm';
import Transcripts from './Transcipts';
import { useMarkersContext } from './markers/markersContext';
import CreateClipForm from './clips/CreateClipForm';
import { TranscriptionStatus } from 'streameth-new-server/src/interfaces/state.interface';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';

export default function Sidebar({
  transcribe,
  sessionId,
  transcribeStatus,
  aiAnalysisStatus,
}: {
  transcribe: {
    start: number;
    end: number;
    word: string;
  }[];
  sessionId?: string;
  transcribeStatus: TranscriptionStatus | null;
  aiAnalysisStatus: ProcessingStatus | null;
}) {
  const { isCreatingClip } = useClipContext();
  const { isAddingOrEditingMarker, isImportingMarkers } = useMarkersContext();

  const overlayComponents = [
    {
      condition: isCreatingClip,
      Component: CreateClipForm,
    },
    {
      condition: isAddingOrEditingMarker,
      Component: AddOrEditMarkerForm,
    },
    {
      condition: isImportingMarkers,
      Component: ImportMarkersForm,
    },
  ];

  return (
    <div className="h-full w-full border-l bg-white relative flex flex-col">
      {overlayComponents.map(
        ({ condition, Component }) =>
          condition && (
            <div
              key={Component.name}
              className="absolute inset-0 z-50 bg-white"
            >
              <Component />
            </div>
          )
      )}
      <Tabs defaultValue="clips" className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
          <TabsTrigger value="markers">Markers</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
          {transcribe && (
            <TabsTrigger value="transcribe">Transcribe</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="markers" className="flex-grow overflow-hidden">
          <Markers
            sessionId={sessionId || ''}
            transcribeStatus={transcribeStatus ?? null}
            aiAnalysisStatus={aiAnalysisStatus ?? null}
          />
        </TabsContent>
        <TabsContent value="clips" className="flex-grow overflow-hidden">
          <SessionSidebar />
        </TabsContent>
        <TabsContent
          value="transcribe"
          className="flex-grow overflow-hidden h-full p-4"
        >
          <Transcripts
            transcribe={transcribe}
            sessionId={sessionId}
            transcribeStatus={transcribeStatus ?? null}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
