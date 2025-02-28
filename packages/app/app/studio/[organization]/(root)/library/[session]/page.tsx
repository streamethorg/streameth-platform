'use server';

import { studioPageParams } from '@/lib/types';
import { fetchSession } from '@/lib/services/sessionService';
import { PlayerWithControls } from '@/components/ui/Player';
import { notFound } from 'next/navigation';
import EditSessionForm from './components/EditSessionForm';
import Link from 'next/link';
import SessionOptions from './components/SessionOptions';
import { Label } from '@/components/ui/label';
import GetHashButton from '../components/GetHashButton';
import TextPlaceholder from '@/components/ui/text-placeholder';

import { getVideoUrlAction } from '@/lib/actions/livepeer';
import SessionTranscriptions from './components/SessionTranscriptions';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { IExtendedSession } from '@/lib/types';
const EditSession = async ({ params }: studioPageParams) => {
  if (!params.session) return notFound();
  const session = await fetchSession({
    session: params.session,
  });

  if (!session?.playbackId) throw new Error('Session has no playbackId');

  return (
    <div className="w-full">
      <div className="flex flex-row w-full p-4 space-x-4 max-w-screen-xl overflow-auto">
        {/* Left Column - Video Details (2/3 width) */}
        <div className="w-2/3 bg-white rounded-xl p-4 border">
          <EditSessionForm
            session={session}
            organizationSlug={params.organization}
          />
        </div>
        {/* Right Column - Player and Accordions (1/3 width) */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl p-4 border">
          <div className="flex-shrink-0 mb-4">
            <Suspense fallback={<PlayerSkeleton />}>
              <Player session={session} />
            </Suspense>
          </div>
          <div className="flex flex-col flex-grow overflow-auto">
            <SessionOptions session={session} />

            <div className="space-y-4 mt-4 border-t pt-4 ">
              {/* {session.playbackId && (
                <div className="flex flex-col space-y-2">
                  <Label className="">Playback Id</Label>
                  <TextPlaceholder text={session.playbackId} />
                </div>
              )}
              {session.assetId && (
                <div className="flex flex-col space-y-2">
                  <Label>Asset Id</Label>
                  <TextPlaceholder text={session.assetId} />
                </div>
              )} */}
              <SessionTranscriptions
                videoTranscription={session.transcripts?.text}
                summary={session.transcripts?.summary}
                sessionId={session._id}
                transcriptionState={session.transcripts?.status ?? null}
              />
              {/* <GetHashButton session={session} /> */}
              <div className="flex flex-col space-y-2">
                {/* <Label>Publish to Socials</Label> */}
                <div className="flex flex-row gap-2">
                  {/* <UploadToYoutubeButton
                    organization={organization}
                    organizationSlug={params.organization}
                    sessionId={session._id}
                  />
                  <UploadTwitterButton
                    organization={organization}
                    organizationSlug={params.organization}
                    sessionId={session._id}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSession;

const Player = async ({ session }: { session: IExtendedSession }) => {
  const videoUrl = await getVideoUrlAction(session);
  if (!videoUrl) return notFound();

  return (
    <PlayerWithControls
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
  );
};

// Skeleton component for Player
const PlayerSkeleton = () => (
  <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-md">
    <div className="h-full flex items-center justify-center">
      <span>Loading player...</span>
    </div>
  </div>
);

// Skeleton component for Transcript
const TranscriptSkeleton = () => (
  <div className="flex flex-col space-y-2">
    <Label>Transcript</Label>
    <Button loading={true} className="w-full animate-pulse" variant="primary">
      Generate Transcriptions
    </Button>
  </div>
);
