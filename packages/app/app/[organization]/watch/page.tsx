import { PlayerWithControls } from '@/components/ui/Player';
import SessionInfoBox from '@/components/sessions/SessionInfoBox';
import { IExtendedSession, OrganizationPageProps } from '@/lib/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generalMetadata, watchMetadata } from '@/lib/utils/metadata';
import { fetchSession } from '@/lib/services/sessionService';
import { fetchOrganization } from '@/lib/services/organizationService';
import { Suspense } from 'react';
import WatchGrid from '../components/WatchGrid';
import { getVideoUrlAction } from '@/lib/actions/livepeer';
import { generateThumbnailAction } from '@/lib/actions/sessions';

const Loading = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-7xl animate-pulse flex-col gap-4">
      <div className="flex h-full w-full flex-col md:p-4">
        <div className="aspect-video w-full bg-gray-300"></div>
        <div className="mt-4 w-full space-y-2 px-4 md:px-0">
          <div className="h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        </div>
      </div>
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 w-full rounded bg-gray-300 md:h-60"></div>
          <div className="h-32 w-full rounded bg-gray-300 md:h-60"></div>
          <div className="h-32 w-full rounded bg-gray-300 md:h-60"></div>
          <div className="h-32 w-full rounded bg-gray-300 md:h-60"></div>
        </div>
      </div>
    </div>
  );
};

export default async function Watch({
  params,
  searchParams,
}: OrganizationPageProps) {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) {
    return notFound();
  }

  if (!searchParams.session) return notFound();

  const session = await fetchSession({
    session: searchParams.session,
  });

  // Check if session exists and has a playbackId. If not, return a 'not found' response.
  if (!session?.playbackId) return notFound();

  const videoUrl = await getVideoUrlAction(session);
  // If we couldn't get a video URL, return a 'not found' response.
  if (!videoUrl) return notFound();

  const thumbnail = await generateThumbnailAction(session);

  return (
    <Suspense key={session._id} fallback={<Loading />}>
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-4">
        <div className="flex h-full w-full flex-col md:p-4">
          <PlayerWithControls
            name={session.name}
            thumbnail={session.coverImage ?? thumbnail}
            caption={session?.transcripts?.subtitleUrl}
            src={[
              {
                src: videoUrl as `${string}m3u8`,
                width: 1920,
                height: 1080,
                mime: 'application/vnd.apple.mpegurl',
                type: 'hls',
              },
            ]}
          />
          <div className="w-full px-4 md:px-0">
            <SessionInfoBox
              name={session.name}
              description={session.description ?? 'No description'}
              speakers={session.speakers}
              date={session.createdAt as string}
              playbackId={session.playbackId}
              organizationSlug={params.organization}
              vod={true}
              video={session as IExtendedSession}
            />
          </div>
        </div>
        <div className="px-4">
          <div className="md:hidden">
            <WatchGrid organizationSlug={params.organization} />
          </div>
          <div className="hidden md:block">
            <WatchGrid organizationSlug={params.organization} gridLength={6} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: OrganizationPageProps): Promise<Metadata> {
  if (!searchParams.session) return generalMetadata;

  const session = await fetchSession({
    session: searchParams.session,
  });
  const organization = await fetchOrganization({
    organizationSlug: params?.organization,
  });

  if (!session || !organization) return generalMetadata;

  const thumbnail =
    session.coverImage || (await generateThumbnailAction(session));

  return watchMetadata({ organization, session: session, thumbnail });
}
