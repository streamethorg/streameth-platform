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
      <div className="flex h-96 w-full flex-col items-center justify-center gap-4 rounded-xl border bg-white">
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
    <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {streams?.map((stream) => (
        <Link
          key={stream._id}
          href={`/studio/${organizationSlug}/livestreams/${stream?._id}`}
          className="flex flex-col rounded-xl border"
        >
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
              <p className="line-clamp-3 font-medium">{stream?.name}</p>
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
                <LivestreamActions
                  stream={stream}
                  organizationSlug={organizationSlug}
                />
              </PopoverContent>
            </Popover>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LivestreamTable;
