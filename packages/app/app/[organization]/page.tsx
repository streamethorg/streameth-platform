import { Metadata, ResolvingMetadata } from 'next';
import { fetchOrganization } from '@/lib/services/organizationService';
import { ChannelPageParams } from '@/lib/types';
import { Suspense } from 'react';
import UpcomingStreams, {
  UpcomingStreamsLoading,
} from './components/UpcomingStreams';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import ChannelDescription from './components/ChannelDescription';
import { livestreamMetadata, generalMetadata } from '@/lib/utils/metadata';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ArchiveVideos from './videos/components/ArchiveVideos';
import ArchiveVideoSkeleton from './livestream/components/ArchiveVideosSkeleton';
import ChannelBanner from './components/ChannelBanner';

const OrganizationHome = async ({
  params,
  searchParams,
}: ChannelPageParams) => {

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 md:p-4">
      <ChannelBanner />
      <Tabs defaultValue="videos">
        <TabsList>
          <TabsTrigger value="livestreams">
            <h1 className="text-xl font-bold">Upcoming Streams</h1>
          </TabsTrigger>
          <TabsTrigger value="videos">
            <h1 className="text-xl font-bold">Videos</h1>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="livestreams" className="px-4 md:px-0">
          <Suspense fallback={<UpcomingStreamsLoading />}>
            <UpcomingStreams
              organizationId={params.organization}
              currentStreamId={searchParams.streamId}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="videos" className="px-4 md:px-0">
          <Suspense fallback={<ArchiveVideoSkeleton />}>
            <ArchiveVideos
              organizationId={params.organization}
              organizationSlug={params.organization}
              searchQuery={searchParams.search}
              gridLength={12}
              page={Number(searchParams.page) || 1}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export async function generateMetadata(
  { params }: ChannelPageParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!params.organization) {
    return generalMetadata;
  }

  const organization = await fetchOrganization({
    organizationId: params.organization,
  });

  if (!organization) {
    return generalMetadata;
  }

  const allStreams = (
    await fetchOrganizationStages({
      organizationId: organization._id,
    })
  ).filter((stream) => stream.published);

  const sortedStreams = allStreams.sort(
    (a, b) =>
      new Date(a.streamDate as string).getTime() -
      new Date(b.streamDate as string).getTime()
  );

  const stage = sortedStreams.length > 0 ? sortedStreams[0] : null;

  if (!stage) {
    return generalMetadata;
  }

  return livestreamMetadata({
    livestream: stage,
    organization,
  });
}

export default OrganizationHome;
