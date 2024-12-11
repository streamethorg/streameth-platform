'use server';

import { formatDate } from '@/lib/utils/time';
import Link from 'next/link';
import React from 'react';
import { EllipsisVertical } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import LivestreamActions from './LivestreamActions';
import { CardDescription, CardTitle } from '@/components/ui/card';
import EmptyFolder from '@/lib/svg/EmptyFolder';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import PlayerWithControls from '@/components/ui/Player';
import { buildPlaybackUrl } from '@/lib/utils/utils';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';

const LivestreamTable = async ({
  organizationId,
  organizationSlug,
  fromDate,
  untilDate,
}: {
  organizationId: string;
  organizationSlug: string;
  fromDate?: string;
  untilDate?: string;
}) => {
  const streams = await fetchOrganizationStages({
    organizationId,
    fromDate,
    untilDate,
  });

  if (streams.length === 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center w-full h-96 bg-white rounded-xl border">
        <EmptyFolder />
        <CardTitle className="text-2xl font-semibold">
          No livestreams found
        </CardTitle>
        <CardDescription>
          Create your first livestream to get started!
        </CardDescription>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {streams?.map((stream) => (
        <div key={stream._id} className="flex flex-col rounded-xl border">
          <Link
            href={`/studio/${organizationSlug}/livestreams/${stream?._id}`}
            className="relative w-full"
          >
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
          </Link>
          <div className="flex flex-row justify-between p-4">
            <div className="flex flex-col">
              <Link
                href={`/studio/${organizationSlug}/livestreams/${stream?._id}`}
              >
                <p className="font-medium line-clamp-3">{stream?.name}</p>
              </Link>
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
              <PopoverTrigger className="flex z-10 items-center">
                <EllipsisVertical />
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <LivestreamActions
                  stream={stream}
                  organizationSlug={organizationSlug}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LivestreamTable;
