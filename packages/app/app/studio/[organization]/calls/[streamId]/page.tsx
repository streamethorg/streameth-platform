'use server';

import React from 'react';
import LivestreamEmbedCode from '../../livestreams/[streamId]/components/LivestreamEmbedCode';
import { fetchStage } from '@/lib/services/stageService';
import { LivestreamPageParams } from '@/lib/types';
import StreamHeader from '../../livestreams/[streamId]/components/StreamHeader';
import NotFound from '@/app/not-found';
import Destinations from '../../livestreams/[streamId]/components/Destinations';
import StreamHealth from '../../livestreams/[streamId]/components/StreamHealth';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ShareLivestream from '../../livestreams/components/ShareLivestream';
import { fetchOrganization } from '@/lib/services/organizationService';
import { createHuddleRoom } from '@/lib/services/huddleService';
import HuddlePlayer from './components/HuddlePlayer';

const Livestream = async ({ params }: LivestreamPageParams) => {
  if (!params.streamId) return null;
  const stream = await fetchStage({ stage: params.streamId });
  const organization = await fetchOrganization({
    organizationId: params.organization,
  });

  if (!stream || !organization) {
    return NotFound();
  }

  const room = await createHuddleRoom({
    title: stream.name,
    hostWallets: ['0x1234567890'],
  });

  const huddleProjectId = process.env.NEXT_HUDDLE_PROJECT_ID;

  if (!room || !huddleProjectId) {
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
          <HuddlePlayer
            roomUrl={room.data.roomId}
            projectId={huddleProjectId}
          />
          <div className="flex w-full flex-col items-center space-x-2 space-y-2 py-2 md:flex-row lg:flex-row">
            <div className="flex flex-grow items-center justify-start space-x-2">
              <span className="line-clamp-2 text-xl font-bold lg:max-w-[550px]">
                {stream.name}
              </span>
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
