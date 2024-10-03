'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Markers from './markers/index';
import SessionSidebar from './clips';
import { useClipContext } from '../ClipContext';
import CreateClipButton from '../topBar/CreateClipButton';
import AddOrEditMarkerForm from './markers/AddOrEditMarkerForm';
import { IExtendedSession } from '@/lib/types';
import ImportMarkersForm from './markers/ImportMarkersForm';

export default function Sidebar({
  organizationId,
  stageSessions,
  liveRecordingId,
}: {
  organizationId: string;
  stageSessions: IExtendedSession[];
  liveRecordingId?: string;
}) {
  const { isCreatingClip, isAddingOrEditingMarker, isImportingMarkers } =
    useClipContext();

  const overlayComponents = [
    {
      condition: isCreatingClip,
      Component: CreateClipButton,
      usesLiveRecordingId: true,
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
    <div className="h-full w-full border-l bg-white relative">
      {overlayComponents.map(
        ({ condition, Component, usesLiveRecordingId }) =>
          condition && (
            <div
              key={Component.name}
              className="h-full w-full border-l bg-white absolute z-50"
            >
              <Component
                organizationId={organizationId}
                {...(usesLiveRecordingId ? { liveRecordingId } : {})}
              />
            </div>
          )
      )}
      <Tabs defaultValue="clips" className=" h-full ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="markers">Markers</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
        </TabsList>
        <TabsContent value="markers" className="h-full">
          {<Markers organizationId={organizationId} />}
        </TabsContent>
        <TabsContent value="clips" className="h-full">
          <SessionSidebar sessions={stageSessions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
