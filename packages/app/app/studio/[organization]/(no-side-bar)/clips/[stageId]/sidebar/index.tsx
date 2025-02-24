'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Markers from './markers/index';
import SessionSidebar from './clips';
import { useClipPageContext } from '../ClipPageContext';
import AddOrEditMarkerForm from './markers/AddOrEditMarkerForm';
import ImportMarkersForm from './markers/ImportMarkersForm';
import Transcripts from './Transcipts';
import { useMarkersContext } from './markers/markersContext';
import CreateClipForm from './clips/CreateClipForm';
import {
  IAiAnalysis,
  ITranscript,
} from 'streameth-new-server/src/interfaces/transcribe.interface';

export default function Sidebar({
  transcripts,
  aiAnalysis,
}: {
  transcripts: ITranscript | null;
  aiAnalysis: IAiAnalysis | null;
}) {
  const { isCreatingClip, sessionId } = useClipPageContext();
  const { isAddingOrEditingMarker, isImportingMarkers } = useMarkersContext();
  const { status: transcribeStatus } = transcripts ?? { status: null };
  const { status: aiAnalysisStatus } = aiAnalysis ?? { status: null };

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
          <TabsTrigger value="transcribe">Transcribe</TabsTrigger>
        </TabsList>
        <TabsContent value="markers" className="flex-grow overflow-hidden">
          <Markers
            transcribeStatus={transcribeStatus}
            aiAnalysisStatus={aiAnalysisStatus}
          />
        </TabsContent>
        <TabsContent value="clips" className="flex-grow overflow-hidden">
          <SessionSidebar />
        </TabsContent>
        <TabsContent
          value="transcribe"
          className="flex-grow overflow-y-auto h-full p-4"
        >
          <Transcripts transcripts={transcripts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
