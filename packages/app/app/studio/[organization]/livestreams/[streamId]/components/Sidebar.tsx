'use client';

import {
  IExtendedOrganization,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types';
import Destinations from './Destinations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClipsList from './ClipsList';
import { Card } from '@/components/ui/card';

const Sidebar = ({
  stage,
  sessions,
  organization,
}: {
  stage: IExtendedStage;
  sessions: IExtendedSession[];
  organization: IExtendedOrganization;
}) => {
  return (
    <Tabs defaultValue="clips" className="w-[400px]">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="clips">Clips</TabsTrigger>
        <TabsTrigger value="destinations">Destinations</TabsTrigger>
      </TabsList>
      <TabsContent className="h-full" value="clips">
        <Card className="shadow-none h-[calc(100%-20px)] w-full overflow-y-scroll">
          <ClipsList sessions={sessions} />
        </Card>
      </TabsContent>
      <TabsContent className="h-[calc(100%-20px)]" value="destinations">
        <Destinations stream={stage} organization={organization} />
      </TabsContent>
    </Tabs>
  );
};

export default Sidebar;
