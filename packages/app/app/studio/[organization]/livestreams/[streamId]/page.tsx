'use server';

import React from 'react';
import LivestreamEmbedCode from './components/LivestreamEmbedCode';
import { fetchStage } from '@/lib/services/stageService';
import { LivestreamPageParams } from '@/lib/types';
import StreamConfigWithPlayer from './components/StreamConfigWithPlayer';
import StreamHeader from './components/StreamHeader';
import ShareButton from '@/components/misc/interact/ShareButton';
import NotFound from '@/app/not-found';
import Destinations from './components/Destinations';
import StreamHealth from './components/StreamHealth';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ShareLivestream from '../components/ShareLivestream';
import { fetchOrganization } from '@/lib/services/organizationService';
import ImportDataButton from './components/StageDataImport/ImportDataButton';
import ViewSessionsDialog from './components/StageDataImport/ViewSessionsDialog';
import { fetchAllSessions } from '@/lib/services/sessionService';

const Livestream = async ({ params }: LivestreamPageParams) => {
  if (!params.streamId) return null;
  const stream = await fetchStage({ stage: params.streamId });
  const organization = await fetchOrganization({
    organizationId: params.organization,
  });
  const stageSessions = (await fetchAllSessions({ stageId: params.streamId }))
    .sessions;

  if (!stream || !organization) {
    return NotFound();
  }

  return (
    <div className="max-w-screen-3xl flex h-full max-h-[1000px] w-full flex-col p-4">
      <StreamHeader
        organizationSlug={params.organization}
        stream={stream}
        isLiveStreamPage
      />
      <div className="flex w-full flex-grow flex-row space-x-4">
        <div className="flex w-2/3 flex-col">
          <StreamConfigWithPlayer
            stream={stream}
            streamId={params.streamId}
            organization={params.organization}
          />
          <div className="flex w-full flex-col items-center gap-2 py-2 md:flex-row md:flex-wrap">
            <div className="flex items-center justify-start space-x-2">
              <span className="text-xl font-bold pr-4">{stream.name}</span>
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
                View Livestream
                <div>
                  <ArrowRight className="h-4 w-4 pl-1" />
                </div>
              </Button>
            </Link>

            {stageSessions.length > 0 && (
              <ViewSessionsDialog sessions={stageSessions.reverse()} />
            )}

            <ImportDataButton
              organizationId={organization._id}
              stageId={params.streamId}
              stage={stream}
            />
          </div>
        </div>
        <Destinations
          stream={stream}
          organizationSlug={params.organization}
          organization={organization}
        />
      </div>
    </div>
  );
};

export default Livestream;
