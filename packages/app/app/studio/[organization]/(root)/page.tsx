import TableSkeleton from '@/components/misc/Table/TableSkeleton';
import { LivestreamPageParams } from '@/lib/types';
import CreateLivestreamModal from './livestreams/components/CreateLivestreamModal';
import { Suspense } from 'react';
import LivestreamTable from './livestreams/components/LivestreamTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ClipContentButton from './library/components/ClipContentButton';
import UploadVideoDialog from './library/components/UploadVideoDialog';

export default async function OrganizationPage({
  params,
  searchParams,
}: LivestreamPageParams) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return (
    <div className="flex h-full w-full flex-col p-4 overflow-auto">
      <div className="flex w-full flex-col p-2">
        <h2 className="text-lg font-bold">Create</h2>
        <div className="flex items-center gap-4 p-4">
          <CreateLivestreamModal
            variant="primary"
            show={searchParams?.show}
          />
          <UploadVideoDialog />
          <ClipContentButton />
        </div>
      </div>

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">
            <p className="text-lg font-bold">Active livestreams</p>
          </TabsTrigger>
          <TabsTrigger value="past">
            <p className="text-lg font-bold">Past livestreams</p>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="p-4">
          <LivestreamTable
            fromDate={startOfDay.getTime().toString()}
            organizationId={params?.organization}
          />
        </TabsContent>
        <TabsContent value="past" className="p-4">
          <Suspense
            key={searchParams.toString()}
            fallback={
              <div className="flex flex-col h-full bg-white">
                <TableSkeleton />
              </div>
            }
          >
            <LivestreamTable
              untilDate={startOfDay.getTime().toString()}
              organizationId={params?.organization}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
