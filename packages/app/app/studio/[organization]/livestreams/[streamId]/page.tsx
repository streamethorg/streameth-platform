'use server';

import React from 'react';
import LivestreamEmbedCode from './components/LivestreamEmbedCode';
import { fetchStage } from '@/lib/services/stageService';
import { LivestreamPageParams } from '@/lib/types';
import StreamConfigWithPlayer from './components/StreamConfigWithPlayer';
import StreamHeader from './components/StreamHeader';
import NotFound from '@/app/not-found';
import StreamHealth from './components/StreamHealth';
import { Button } from '@/components/ui/button';
import { ArrowRight, MoveIcon, Scissors } from 'lucide-react';
import Link from 'next/link';
import ShareLivestream from '../components/ShareLivestream';
import { fetchOrganization } from '@/lib/services/organizationService';
import ImportDataButton from './components/StageDataImport/ImportDataButton';
import {
  fetchAllSessions,
  fetchAsset,
  fetchSession,
} from '@/lib/services/sessionService';
import Sidebar from './components/Sidebar';
import Preview from '../../Preview';

const Livestream = async ({ params, searchParams }: LivestreamPageParams) => {
  if (!params.streamId) return null;

  const stream = await fetchStage({ stage: params.streamId });
  const organization = await fetchOrganization({
    organizationId: params.organization,
  });

  if (!stream || !organization) {
    return NotFound();
  }

  const stageSessions = (
    await fetchAllSessions({ stageId: stream._id?.toString() })
  ).sessions;

  const previewAsset = await (async function () {
    if (searchParams.previewId) {
      const session = await fetchSession({
        session: searchParams.previewId,
      });
      if (session) {
        return await fetchAsset({
          assetId: session.assetId as string,
        });
      }
    }
    return undefined;
  })();

  return (
    <div className="flex flex-col p-4 w-full h-full max-w-screen-3xl max-h-[1000px]">
      {previewAsset && (
        <Preview
          initialIsOpen={searchParams.previewId !== ''}
          organizationId={organization._id as string}
          asset={previewAsset}
          sessionId={searchParams.previewId}
          organizationSlug={params.organization}
        />
      )}
      <StreamHeader
        organizationSlug={params.organization}
        stream={stream}
        isLiveStreamPage
      />
      <div className="flex flex-row flex-grow space-x-4 w-full">
        <div className="flex flex-col w-2/3">
          <StreamConfigWithPlayer
            stream={stream}
            streamId={params.streamId}
            organization={params.organization}
          />
          <div className="flex flex-col gap-2 items-center py-2 w-full md:flex-row md:flex-wrap">
            <div className="flex justify-start items-center space-x-2">
              <span className="pr-4 text-xl font-bold">{stream.name}</span>
              <StreamHealth
                stream={stream}
                streamId={stream?.streamSettings?.streamId || ''}
                organization={params.organization}
                isLive={stream.streamSettings?.isActive}
              />
            </div>

            <LivestreamEmbedCode
              streamId={stream._id}
              playerName={stream?.name}
            />
            <ShareLivestream
              streamId={params.streamId}
              variant={'outline'}
              organization={params.organization}
            />

            <Link
              href={`/${params.organization}/livestream?stage=${stream._id}`}
              target="_blank"
            >
              <Button variant="outline">
                Watch Livestream
                <div>
                  <ArrowRight className="ml-1 w-5 h-5" />
                </div>
              </Button>
            </Link>
            {/* TODO: Add clip live button redirect */}
            {stream.streamSettings?.isActive && (
              <Button variant={'primary'}>
                Clip Live <Scissors className="ml-2 w-4 h-4" />
              </Button>
            )}

            <ImportDataButton
              organizationId={organization._id}
              stageId={params.streamId}
              stage={stream}
            />
          </div>
        </div>
        <Sidebar
          stage={stream}
          sessions={stageSessions}
          organization={organization}
        />
      </div>
    </div>
  );
};

export default Livestream;
