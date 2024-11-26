import NotFound from '@/not-found';
import { Metadata, ResolvingMetadata } from 'next';
import { fetchOrganization } from '@/lib/services/organizationService';
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

const OrganizationHome = async ({
  params,
  searchParams,
}: ChannelPageParams) => {
  if (!params.organization) {
    return NotFound();
  }

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) {
    return NotFound();
  }

  return (
    <div className="mx-auto space-y-4 w-full max-w-7xl md:p-4">
      <div className="relative w-full">
        <div className="relative z-0 w-full h-48 md:rounded-xl">
          {organization.banner ? (
            <Image
              src={organization.banner}
              alt="banner"
              quality={100}
              objectFit="cover"
              className="md:rounded-xl"
              fill
              priority
            />
          ) : (
            <div className="h-full bg-gray-300 md:rounded-xl">
              <StreamethLogoWhite />
            </div>
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-4 space-y-2 w-full text-white">
            <div className="flex flex-row justify-between w-full">
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
        <TabsContent value="livestreams">
          <Suspense fallback={<UpcomingStreamsLoading />}>
            <UpcomingStreams
              organizationId={organization._id}
              organizationSlug={params.organization}
              currentStreamId={searchParams.streamId}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="videos">
          <ArchiveVideos
            organizationId={organization._id.toString()}
            searchQuery={searchParams.search}
          />
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
