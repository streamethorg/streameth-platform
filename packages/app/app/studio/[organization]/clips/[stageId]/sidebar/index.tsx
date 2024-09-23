'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Markers from './markers/index';
import SessionSidebar from './clips';
import { useClipContext } from '../ClipContext';
import CreateClipButton from '../topBar/CreateClipButton';
export default function Sidebar({
  organizationId,
}: {
  organizationId: string;
}) {
  const { isCreatingClip } = useClipContext();

  if (isCreatingClip) {
    return (
      <div className="h-full w-full border-l bg-background">
        <CreateClipButton organizationId={organizationId} />
      </div>
    );
  }

  return (
    <div className="h-full w-full border-l bg-background bg-white">
      <Tabs defaultValue="clips" className=" h-full ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="markers">Markers</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
        </TabsList>
        <TabsContent value="markers">
          {<Markers organizationId={organizationId} />}
        </TabsContent>
        <TabsContent value="clips" className="h-full">
          <SessionSidebar organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
