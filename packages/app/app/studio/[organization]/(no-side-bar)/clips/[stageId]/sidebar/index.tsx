'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Markers from './markers/index';
import SessionSidebar from './clips';
import { useClipContext } from '../ClipContext';
import CreateClipButton from '../topBar/CreateClipButton';
import AddOrEditMarkerForm from './markers/AddOrEditMarkerForm';
import { IExtendedSession } from '@/lib/types';
import ImportMarkersForm from './markers/ImportMarkersForm';
import Transcripts from './Transcipts';

export default function Sidebar({
  organizationId,
  stageId,
  stageSessions,
  liveRecordingId,
  animations,
  words,
  sessionId,
}: {
  sessionId: string;
  organizationId: string;
  stageId: string;
  stageSessions: IExtendedSession[];
  liveRecordingId?: string;
  animations: IExtendedSession[];
  words?: {
    word: string;
    start: number;
    end: number;
  }[];
}) {
  const { isCreatingClip, isAddingOrEditingMarker, isImportingMarkers } =
    useClipContext();

  const overlayComponents = [
    {
      condition: isCreatingClip,
      Component: CreateClipButton,
      usesLiveRecordingId: true,
      animations: animations,
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
        ({ condition, Component, usesLiveRecordingId }) =>
          condition && (
            <div
              key={Component.name}
              className="absolute inset-0 z-50 bg-white"
            >
              <Component
                organizationId={organizationId}
                {...(usesLiveRecordingId ? { liveRecordingId } : {})}
                animations={animations}
              />
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
          {<Markers organizationId={organizationId} />}
        </TabsContent>
        <TabsContent value="clips" className="flex-grow overflow-hidden">
          <SessionSidebar sessions={stageSessions} />
        </TabsContent>
        {words && (
          <TabsContent value="words" className="flex-grow overflow-hidden h-full p-4">
            <Transcripts
              words={words}
              sessionId={sessionId}
              organizationId={organizationId}
              stageId={stageId}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
