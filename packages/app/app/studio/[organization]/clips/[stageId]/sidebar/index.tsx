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

  // overalay is better ( absolute position) so that when closing we can continue seeing markers / clips as before
  return (
    <div className="h-full w-full border-l bg-white relative">
      {isCreatingClip && (
        <div className="h-full w-full border-l bg-white absolute z-50">
          <CreateClipButton organizationId={organizationId} />
        </div>
      )}
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
