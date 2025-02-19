'use client';
import { useEditorContext } from '../context/EditorContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InfoSidebar = () => {
  const { selectedSession } = useEditorContext();

  return (
    <Tabs defaultValue="info">
      <TabsList>
        <TabsTrigger value="info">Info</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        {selectedSession && (
          <div className="flex flex-col gap-2">
            <p>{selectedSession?.name}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default InfoSidebar;
