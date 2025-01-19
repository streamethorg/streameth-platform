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

export default function Sidebar({
  words,
  sessionId,
}: {
  words?: {
    start: number;
    end: number;
    word: string;
  }[];
  sessionId?: string;
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
          {words && <TabsTrigger value="words">Words</TabsTrigger>}
        </TabsList>
        <TabsContent value="markers" className="flex-grow overflow-hidden">
          <Markers sessionId={sessionId || ''} />
        </TabsContent>
        <TabsContent value="clips" className="flex-grow overflow-hidden">
          <SessionSidebar />
        </TabsContent>
        {words && (
          <TabsContent
            value="words"
            className="flex-grow overflow-hidden h-full p-4"
          >
            <Transcripts words={words} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
