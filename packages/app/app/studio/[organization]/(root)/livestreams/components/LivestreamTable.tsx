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
import { CardDescription, CardTitle } from '@/components/ui/card';
import EmptyFolder from '@/lib/svg/EmptyFolder';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import PlayerWithControls from '@/components/ui/Player';
import { buildPlaybackUrl } from '@/lib/utils/utils';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { Button } from '@/components/ui/button';
import { fetchOrganization } from '@/lib/services/organizationService';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

  const organization = await fetchOrganization({ organizationId });
  const currentStages = organization?.currentStages || 0;
  const paidStages = organization?.paidStages || 0;
  const isOverLimit = currentStages > paidStages;

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
    <div className="flex flex-col gap-4 w-full">
      {isOverLimit && (
        <Alert variant="destructive">
          <AlertDescription>
            You have {currentStages - paidStages} more {currentStages - paidStages === 1 ? 'stage' : 'stages'} than your subscription allows. 
            Please delete {currentStages - paidStages === 1 ? 'it' : 'them'} or upgrade your subscription to continue using all features.
          </AlertDescription>
        </Alert>
      )}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {streams?.map((stream) => (
          <div
            key={stream._id}
            className="flex flex-col rounded-2xl border bg-white"
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
                {isOverLimit ? (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <p className="line-clamp-3 font-medium text-lg text-gray-500">
                      {stream?.name}
                    </p>
                  </div>
                ) : (
                  <Link
                    href={`/studio/${organizationSlug}/livestreams/${stream._id}`}
                    className="w-full"
                  >
                    <Button variant="link" className="md:p-0">
                      <p className="line-clamp-3 font-medium text-lg">
                        {stream?.name}
                      </p>
                    </Button>
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
                  <LivestreamActions
                    stream={stream}
                    organizationSlug={organizationSlug}
                    paidStages={paidStages}
                    currentStages={currentStages}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivestreamTable;
