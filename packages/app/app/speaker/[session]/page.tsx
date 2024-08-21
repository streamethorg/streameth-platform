'use server';

import { PlayerWithControls } from '@/components/ui/Player';
import SessionInfoBox from '@/components/sessions/SessionInfoBox';
import { IExtendedState, OrganizationPageProps } from '@/lib/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generalMetadata, watchMetadata } from '@/lib/utils/metadata';
import { fetchSession } from '@/lib/services/sessionService';
import { fetchOrganization } from '@/lib/services/organizationService';
import { Suspense } from 'react';
import { getVideoUrlAction } from '@/lib/actions/livepeer';
import { generateThumbnailAction } from '@/lib/actions/sessions';
import dynamic from 'next/dynamic';
import SpeakerYoutubePublishButton from './components/SpeakerYoutubePublishButton';
import { cookies } from 'next/headers';
import ZoraUploadButton from './components/ZoraUploadButton';
import { fetchAllStates } from '@/lib/services/stateService';
import { StateType } from 'streameth-new-server/src/interfaces/state.interface';

const ClientSidePlayer = dynamic(
  () => import('./components/ClientSidePlayer'),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const Loading = () => {
  return (
    <div className="flex flex-col gap-4 items-center p-4 w-full h-full animate-pulse md:p-8">
      <div className="w-full max-w-6xl bg-gray-300 aspect-video"></div>
      <div className="space-y-2 w-full max-w-6xl">
        <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const SessionPage = async ({
  params,
  searchParams,
}: {
  params: { session: string };
  searchParams: { m: string };
}) => {
  if (!params.session) return notFound();

  const session = await fetchSession({
    session: params.session,
  });

  if (!session?.playbackId && !session) return notFound();

  const videoUrl = await getVideoUrlAction(session);
  if (!videoUrl) return notFound();

  const state = (await fetchAllStates({ sessionId: session._id })).filter(
    (state) => state.type === StateType.zoraNft
  ) as unknown as IExtendedState;

  const thumbnail = await generateThumbnailAction(session!);
  const youtubeData = cookies().get('youtube_publish')?.value;
  const youtube = youtubeData ? JSON.parse(youtubeData) : undefined;

  return (
    <Suspense key={session!._id} fallback={<Loading />}>
      <div className="flex flex-col items-center w-full h-full md:p-8">
        <div className="w-full max-w-6xl">
          <ClientSidePlayer
            name={session.name}
            thumbnail={session.coverImage ?? thumbnail}
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
          <div className="p-4 mt-4 w-full md:p-0">
            <SessionInfoBox
              name={session!.name}
              description={session!.description ?? 'No description'}
              speakers={session!.speakers}
              date={session!.createdAt as string}
              playbackId={session!.playbackId}
              // organizationSlug={params.organization}
              vod={true}
              video={session!}
            />

            <div className="flex space-x-2">
              <SpeakerYoutubePublishButton
                openModal={searchParams.m}
                sessionId={params.session}
                thumbnail={youtube?.thumbnail}
                refreshToken={youtube?.refreshToken}
              />

              <ZoraUploadButton
                session={session}
                state={state}
                variant="primary"
              />
            </div>
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

  return watchMetadata({ organization, session, thumbnail });
}

export default SessionPage;
