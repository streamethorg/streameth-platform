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
    <Card className="w-1/3 flex flex-col h-[calc(100vh-12rem)] mb-4 overflow-hidden">
      <Tabs defaultValue="destinations" className="flex flex-col h-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
        </TabsList>
        <TabsContent className="flex-grow overflow-hidden" value="clips">
          <div className="h-full overflow-y-auto">
            <ClipsList
              organizationSlug={organization.slug!}
              sessions={sessions}
            />
          </div>
        </TabsContent>
        <TabsContent className="flex-grow overflow-hidden" value="destinations">
          <div className="h-full overflow-y-auto">
            <Destinations stream={stage} organization={organization} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Sidebar;
