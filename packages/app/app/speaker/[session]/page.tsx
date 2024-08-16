'use server';

import { PlayerWithControls } from '@/components/ui/Player';
import SessionInfoBox from '@/components/sessions/SessionInfoBox';
import { OrganizationPageProps } from '@/lib/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generalMetadata, watchMetadata } from '@/lib/utils/metadata';
import { fetchSession } from '@/lib/services/sessionService';
import { fetchOrganization } from '@/lib/services/organizationService';
import { Suspense } from 'react';
import { getVideoUrlAction } from '@/lib/actions/livepeer';
import { generateThumbnailAction } from '@/lib/actions/sessions';
import dynamic from 'next/dynamic';

const ClientSidePlayer = dynamic(
  () => import('./components/ClientSidePlayer'),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const Loading = () => {
  return (
    <div className="flex flex-col items-center gap-4 w-full h-full animate-pulse p-4 md:p-8">
      <div className="w-full max-w-4xl bg-gray-300 aspect-video"></div>
      <div className="w-full max-w-4xl space-y-2">
        <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const SessionPage = async ({ params }: any) => {
  if (!params.session) return notFound();

  const session = await fetchSession({
    session: params.session,
  });

  if (!session?.playbackId && !session) return notFound();

  const videoUrl = await getVideoUrlAction(session!);
  if (!videoUrl) return notFound();

  const thumbnail = await generateThumbnailAction(session!);

  return (
    <Suspense key={session!._id} fallback={<Loading />}>
      <div className="flex flex-col items-center w-full h-full p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <ClientSidePlayer
            name={session!.name}
            thumbnail={session!.coverImage ?? thumbnail}
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
          <div className="w-full mt-4">
            <SessionInfoBox
              name={session!.name}
              description={session!.description ?? 'No description'}
              speakers={session!.speakers}
              date={session!.createdAt as string}
              playbackId={session!.playbackId}
              organizationSlug={params.organization}
              vod={true}
              video={session!}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
};
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
    session.coverImage ?? (await generateThumbnailAction(session));

  return watchMetadata({ organization, session: session, thumbnail });
}

export default SessionPage;
