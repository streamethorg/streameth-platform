import { TableCell } from '@/components/ui/table';
import { IExtendedSession, eLayout } from '@/lib/types';
import {
  EllipsisVertical,
  Users,
  Video,
  Scissors,
  Radio,
  FilePenLine,
  ScissorsLineDashed,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatDuration } from '@/lib/utils/time';
import { fetchSessionMetrics } from '@/lib/services/sessionService';
import ProcessingSkeleton from './misc/ProcessingSkeleton';
import { PopoverActions } from './misc/PopoverActions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { generateThumbnailAction } from '@/lib/actions/sessions';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { ClippingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import { Button } from '@/components/ui/button';
import { getTypeLabel } from '@/lib/utils/utils';

const TableCells = async ({
  item,
  organization,
}: {
  item: IExtendedSession;
  organization: string;
}) => {
  const imageUrl = await generateThumbnailAction(item);
  const views = (
    await fetchSessionMetrics({ playbackId: item.playbackId ?? '' })
  ).viewCount;

  if (
    item.clippingStatus === ClippingStatus.pending ||
    item.clippingStatus === ClippingStatus.failed
  ) {
    return <ProcessingSkeleton item={item} />;
  }

  const duration = item.playback?.duration
    ? formatDuration(item.playback.duration * 1000) // Convert seconds to milliseconds
    : 'N/A';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clip':
        return <Scissors className="w-4 h-4 text-green-500" />;
      case 'livestream':
        return <Radio className="w-4 h-4 text-red-500" />;
      case 'video':
      default:
        return <Video className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <>
      <TableCell className="relative max-w-[300px] font-medium">
        <div className="flex w-full flex-row items-center space-x-4">
          <div className="min-w-[100px]">
            <Thumbnail imageUrl={item.coverImage} fallBack={imageUrl} />
          </div>
          <div className="flex flex-col">
            <Link href={`/studio/${organization}/library/${item._id}`}>
              <span className="line-clamp-2 hover:underline">{item.name}</span>
            </Link>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          {getTypeIcon(item.type)}
          <span>{getTypeLabel(item.type)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <span>{duration}</span>
        </div>
      </TableCell>
      <TableCell>
        {formatDate(new Date(item.createdAt as string), 'ddd. MMM. D, YYYY')}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{views} views</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {/* and less than 7 days old */}
          {item.type === 'livestream' &&
            item.createdAt &&
            new Date(item.createdAt).getTime() >
              Date.now() - 7 * 24 * 60 * 60 * 1000 && (
              <Link
                href={`/studio/${organization}/clips/stage?sessionId=${item._id}&videoType='recording'`}
              >
                <Button variant="primary" size="icon" className="mr-2">
                  <ScissorsLineDashed className="w-5 h-5 cursor-pointer" />
                </Button>
              </Link>
            )}
          <Link href={`/studio/${organization}/library/${item._id}`}>
            <Button variant="outline" size="icon" className="mr-2">
              <FilePenLine className="w-5 h-5 cursor-pointer" />
            </Button>
          </Link>
          <Popover>
            <PopoverTrigger className="z-10">
              <EllipsisVertical className="w-5 h-5 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <PopoverActions
                session={item}
                organizationSlug={organization}
                layout={eLayout.list}
              />
            </PopoverContent>
          </Popover>
        </div>
      </TableCell>
    </>
  );
};

export default TableCells;
