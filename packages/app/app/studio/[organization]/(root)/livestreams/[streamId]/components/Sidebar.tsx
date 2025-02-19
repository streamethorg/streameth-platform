'use client';

import {
  IExtendedOrganization,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types';
import Destinations from './Destinations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const Sidebar = ({
  stage,
  // sessions,
}: {
  stage: IExtendedStage;
  // sessions: IExtendedSession[];
}) => {
  return (
    <Card className="md:shadow-none w-full flex flex-col h-[calc(100vh-12rem)] mb-4 overflow-hidden">
      <Tabs defaultValue="destinations" className="flex flex-col h-full">
        <TabsList className=" w-full">
          <TabsTrigger value="destinations" className="w-full">
            Destinations
          </TabsTrigger>
          {/* <TabsTrigger value="clips">Clips</TabsTrigger> */}
        </TabsList>
        {/* <TabsContent className="flex-grow overflow-hidden" value="clips">
          <div className="h-full overflow-y-auto">
            <ClipsList
              organizationSlug={organization.slug!}
              sessions={sessions}
            />
          </div>
        </TabsContent> */}
        <TabsContent className="flex-grow overflow-hidden" value="destinations">
          <div className="h-full overflow-y-auto">
            <Destinations stream={stage} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Sidebar;
