import TableSkeleton from '@/components/misc/Table/TableSkeleton';
import { LivestreamPageParams } from '@/lib/types';
import CreateLivestreamModal from './livestreams/components/CreateLivestreamModal';
import { Suspense } from 'react';
import { fetchOrganization } from '@/lib/services/organizationService';
import LivestreamTable from './livestreams/components/LivestreamTable';
import { notFound } from 'next/navigation';
import UploadVideoDialog from './library/components/UploadVideoDialog';
import { Button } from '@/components/ui/button';
import { FileUp, ScissorsLineDashed } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FeatureButton from '@/components/ui/feature-button';
import { Radio } from 'lucide-react';
import { isFeatureAvailable } from '@/lib/utils/utils';

export default async function OrganizationPage({
  params,
  searchParams,
}: LivestreamPageParams) {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) return notFound();

  const hasValidSubscription = isFeatureAvailable(organization.expirationDate);
  const hasReachedStageLimit = (organization.currentStages ?? 0) >= (organization.paidStages ?? 0);

  // Calculate the start of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return (
    <div className="flex h-full w-full flex-col p-4 overflow-auto">
      <div className="flex w-full flex-col p-2">
        <h2 className="text-lg font-bold">Create</h2>
        <div className="flex items-center gap-4 p-4">
          {hasValidSubscription ? (
            hasReachedStageLimit ? (
              <FeatureButton
                organizationId={organization._id.toString()}
                variant="primary"
                className="flex items-center gap-2"
                forceLockedState={true}
              >
                <Radio className="w-5 h-5" />
                Create Livestream
              </FeatureButton>
            ) : (
              <CreateLivestreamModal
                variant="primary"
                show={searchParams?.show}
                organization={organization}
              />
            )
          ) : (
            <FeatureButton
              organizationId={organization._id.toString()}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Radio className="w-5 h-5" />
              Create Livestream
            </FeatureButton>
          )}

          {hasValidSubscription ? (
            <UploadVideoDialog organizationId={organization._id.toString()} />
          ) : (
            <FeatureButton
              organizationId={organization._id.toString()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileUp className="w-5 h-5" />
              Upload Video
            </FeatureButton>
          )}

          {hasValidSubscription ? (
            <Link
              href={`/studio/${organization.slug}/library?layout=list&page=1&limit=20&clipable=true`}
            >
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <ScissorsLineDashed className="w-5 h-5" />
                <span>Clip Content</span>
              </Button>
            </Link>
          ) : (
            <FeatureButton
              organizationId={organization._id.toString()}
              variant="outline"
              className="flex items-center gap-2 h-10"
            >
              <ScissorsLineDashed className="w-5 h-5" />
              <span>Clip Content</span>
            </FeatureButton>
          )}
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
}
