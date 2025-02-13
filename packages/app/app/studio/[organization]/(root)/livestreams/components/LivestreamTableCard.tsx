'use client';

import { formatDate } from '@/lib/utils/time';
import Link from 'next/link';
import React from 'react';
import { EllipsisVertical, Lock } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import LivestreamActions from './LivestreamActions';
import PlayerWithControls from '@/components/ui/Player';
import { buildPlaybackUrl } from '@/lib/utils/utils';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { IExtendedStage } from '@/lib/types';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const LivestreamTableCard = ({ stream }: { stream: IExtendedStage }) => {
  const { stagesStatus, subscriptionStatus, organizationId } = useOrganizationContext();
  const { isOverLimit } = stagesStatus;
  const isLocked = isOverLimit || subscriptionStatus.hasExpired;

  return (
    <div key={stream._id} className="flex flex-col rounded-2xl border bg-white">
      <div className="relative w-full">
        {stream.streamSettings?.isActive &&
        stream.streamSettings?.playbackId ? (
          <PlayerWithControls
            thumbnail={stream.thumbnail}
            name={stream.name}
            src={[
              {
                src: buildPlaybackUrl(
                  stream.streamSettings?.playbackId
                ) as `${string} m3u8`,
                width: 1920,
                height: 1080,
                mime: 'application/vnd.apple.mpegurl',
                type: 'hls',
              },
            ]}
          />
        ) : (
          <Thumbnail imageUrl={stream.thumbnail} />
        )}
      </div>
      <div className="p-4 flex flex-row justify-between">
        <div className="flex flex-col">
          {isLocked ? (
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <p className="line-clamp-3 font-medium text-lg text-gray-500 text-ellipsis">
                {stream?.name}
              </p>
            </div>
          ) : (
            <Link
              href={`/studio/${organizationId}/livestreams/${stream._id}`}
              className="w-full max-h-12 overflow-clip "
            >
              <p className="line-clamp-3 font-medium text-lg text-ellipsis">
                {stream?.name}
              </p>
            </Link>
          )}
          <p className="text-sm">
            {stream?.streamDate
              ? formatDate(new Date(stream?.streamDate), 'MMM D, YYYY')
              : formatDate(
                  new Date(stream?.createdAt as string),
                  'MMM D, YYYY'
                )}
          </p>
        </div>
        <Popover>
          <PopoverTrigger className="z-10 flex items-center">
            <EllipsisVertical />
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <LivestreamActions stream={stream} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LivestreamTableCard;
