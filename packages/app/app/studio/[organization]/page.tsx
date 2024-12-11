'use server';

import TableSkeleton from '@/components/misc/Table/TableSkeleton';
import { LivestreamPageParams, eSort } from '@/lib/types';
import CreateLivestreamModal from './livestreams/components/CreateLivestreamModal';
import { Suspense } from 'react';
import { fetchOrganization } from '@/lib/services/organizationService';
import LivestreamTable from './livestreams/components/LivestreamTable';
import { notFound } from 'next/navigation';
import UploadVideoDialog from './library/components/UploadVideoDialog';
import { Button } from '@/components/ui/button';
import { ScissorsLineDashed } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const OrganizationPage = async ({
  params,
  searchParams,
}: LivestreamPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) return notFound();

  // Calculate the start of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return (
    <div className="flex overflow-auto flex-col p-4 w-full h-full">
      <div className="flex flex-col w-full">
        <h2 className="text-3xl font-bold">Create</h2>
        <div className="flex gap-4 items-center py-4 max-w-5xl md">
          <CreateLivestreamModal
            show={searchParams?.show}
            organization={organization}
          />
          <UploadVideoDialog organizationId={organization._id.toString()} />
          <Link
            href={`/studio/${organization.slug}/library?layout=list&page=1&limit=20&clipable=true`}
          >
            <Button
              variant={'outline'}
              className="flex flex-row justify-start items-center p-2 pr-4 space-x-4 h-auto bg-white rounded-xl border w-fit"
            >
              <div>
                <ScissorsLineDashed size={20} />
              </div>
              <span className="text-sm">Clip Content</span>
            </Button>
          </Link>
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
        <TabsContent value="current" className="py-4">
          <LivestreamTable
            fromDate={startOfDay.getTime().toString()}
            organizationId={organization._id}
            organizationSlug={params?.organization}
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
              organizationId={organization._id}
              organizationSlug={params?.organization}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationPage;
