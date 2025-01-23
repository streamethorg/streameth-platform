import NotFound from '@/not-found';
import { Metadata, ResolvingMetadata } from 'next';
import {
  fetchOrganization,
} from '@/lib/services/organizationService';
import { ChannelPageParams } from '@/lib/types';
import ChannelShareIcons from './components/ChannelShareIcons';
import Image from 'next/image';
import { Suspense } from 'react';
import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite';
import UpcomingStreams, {
  UpcomingStreamsLoading,
} from './components/UpcomingStreams';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import ChannelDescription from './components/ChannelDescription';
import { livestreamMetadata, generalMetadata } from '@/lib/utils/metadata';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ArchiveVideos from './videos/components/ArchiveVideos';
import ArchiveVideoSkeleton from './livestream/components/ArchiveVideosSkeleton';

const OrganizationHome = async ({
  params,
  searchParams,
}: ChannelPageParams) => {

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) {
    return NotFound();
  }



  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 md:p-4">
      <div className="relative w-full">
        <div className="relative z-0 w-full md:rounded-xl h-48">
          {organization.banner ? (
            <Image
              src={organization.banner}
              alt="banner"
              quality={100}
              objectFit="cover"
              className="md:rounded-xl "
              fill
              priority
            />
          ) : (
            <div className="h-full bg-gray-300 md:rounded-xl">
              <StreamethLogoWhite />
            </div>
          )}
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full space-y-2 p-4 text-white">
            <div className="flex w-full flex-row justify-between">
              <div className="overflow-hidden">
                <h2 className="text-2xl font-bold">{organization.name}</h2>
                <ChannelDescription description={organization.description} />
              </div>
              <ChannelShareIcons organization={organization} />
            </div>
          </div>
        </div>
      </div>
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
              organizationId={organization._id}
              organizationSlug={params.organization}
              currentStreamId={searchParams.streamId}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="videos" className="px-4 md:px-0">
        <Suspense fallback={<ArchiveVideoSkeleton />}>
          <ArchiveVideos
              organizationId={organization._id}
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
    organizationSlug: params.organization,
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
