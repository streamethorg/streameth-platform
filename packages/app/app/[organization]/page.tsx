import NotFound from '@/not-found';
import { Metadata, ResolvingMetadata } from 'next';
import {
  fetchOrganization,
  fetchOrganizations,
} from '@/lib/services/organizationService';
import { ChannelPageParams } from '@/lib/types';
import ChannelShareIcons from './components/ChannelShareIcons';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite';
import WatchGrid, { WatchGridLoading } from './components/WatchGrid';
import UpcomingStreams, {
  UpcomingStreamsLoading,
} from './components/UpcomingStreams';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import Player from './livestream/components/Player';
import SessionInfoBox from '@/components/sessions/SessionInfoBox';
import ChannelDescription from './components/ChannelDescription';
import { livestreamMetadata, generalMetadata } from '@/lib/utils/metadata';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const organizations = await fetchOrganizations();

  return organizations
    .map((organization) => organization.slug)
    .filter((slug): slug is string => typeof slug === 'string')
    .map((slug) => ({ organization: slug }));
}

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

  const allStreams = (
    await fetchOrganizationStages({
      organizationId: organization._id,
    })
  ).filter(
    (stream) =>
      stream.published &&
      (stream.streamSettings?.isActive ||
        new Date(stream?.streamDate as string) > new Date())
  );

  const sortedStreams = allStreams.sort(
    (a, b) =>
      new Date(a.streamDate as string).getTime() -
      new Date(b.streamDate as string).getTime()
  );

  const stage = sortedStreams.length > 0 ? sortedStreams[0] : null;

  return (
    <div className="mx-auto space-y-4 w-full max-w-7xl md:p-4">
      <div className="relative w-full">
        {stage ? (
          <>
            <Player stage={stage} />
            <div className="px-4 w-full md:p-0">
              <SessionInfoBox
                name={stage.name}
                description={stage.description ?? ''}
                date={stage.streamDate as string}
                vod={true}
                video={stage}
              />
            </div>
          </>
        ) : (
          <AspectRatio
            ratio={3 / 1}
            className="relative z-0 mt-3 w-full md:rounded-xl"
          >
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
                <div>
                  <h2 className="text-2xl font-bold">{organization.name}</h2>
                  <ChannelDescription description={organization.description} />
                </div>
                <ChannelShareIcons organization={organization} />
              </div>
            </div>
          </AspectRatio>
        )}
      </div>
      <Card className="p-4 space-y-6 w-full bg-white border-none shadow-none md:p-0">
        <Suspense fallback={<UpcomingStreamsLoading />}>
          <UpcomingStreams
            organizationId={organization._id}
            organizationSlug={params.organization}
            currentStreamId={searchParams.streamId}
          />
        </Suspense>
        <Suspense fallback={<WatchGridLoading />}>
          <div className="md:hidden">
            <WatchGrid organizationSlug={params.organization} />
          </div>
          <div className="hidden md:block">
            <WatchGrid organizationSlug={params.organization} gridLength={6} />
          </div>
        </Suspense>
      </Card>
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
