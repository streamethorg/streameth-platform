import { TableCell } from '@/components/ui/table';
import { IExtendedSession, eLayout } from '@/lib/types';
import { Users, FilePenLine } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatDuration } from '@/lib/utils/time';
import { fetchSessionMetrics } from '@/lib/services/sessionService';
import ProcessingSkeleton from './misc/ProcessingSkeleton';
import { generateThumbnailAction } from '@/lib/actions/sessions';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import { Button } from '@/components/ui/button';
import { getTypeLabel } from '@/lib/utils/utils';
import {
  LuClapperboard,
  LuFilm,
  LuRadio,
  LuScissors,
  LuScissorsLineDashed,
  LuVideo,
} from 'react-icons/lu';
import DropdownActions from './DropdownActions';

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
    item.processingStatus === ProcessingStatus.pending ||
    item.processingStatus === ProcessingStatus.failed
  ) {
    return <ProcessingSkeleton item={item} />;
  }

  const duration = item.playback?.duration
    ? formatDuration(item.playback.duration * 1000) // Convert seconds to milliseconds
    : 'N/A';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clip':
        return <LuScissors className="w-4 h-4 text-green-500" />;
      case 'livestream':
        return <LuRadio className="w-4 h-4 text-red-500" />;
      case 'video':
        return <LuVideo className="w-4 h-4 text-sky-500" />;
      case 'animation':
        return <LuClapperboard className="w-4 h-4 text-yellow-500" />;
      case 'editorClip':
        return <LuFilm className="w-4 h-4 text-purple-500" />;
      default:
        return <LuVideo className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <>
      <TableCell className="relative font-medium max-w-[300px]">
        <div className="flex flex-row items-center space-x-4 w-full">
          <div className="min-w-[100px]">
            <Thumbnail imageUrl={item.coverImage} fallBack={imageUrl} />
          </div>
          <div className="flex flex-col">
            <Link href={`/studio/${organization}/library/${item._id}`}>
              <span className="hover:underline line-clamp-2">{item.name}</span>
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
        <div className="flex justify-end items-center space-x-2 max-w-[100px]">
          {item.type === 'livestream' &&
            item.createdAt &&
            new Date(item.createdAt).getTime() >
              Date.now() - 7 * 24 * 60 * 60 * 1000 && (
              <Link
                href={`/studio/${organization}/clips/${item.stageId}?sessionId=${item._id}&videoType=recording`}
              >
                <Button variant="primary" size="icon" className="mr-2">
                  <LuScissorsLineDashed className="w-5 h-5 cursor-pointer" />
                </Button>
              </Link>
            )}
          <Link href={`/studio/${organization}/library/${item._id}`}>
            <Button variant="outline" size="icon" className="mr-2">
              <FilePenLine className="w-5 h-5 cursor-pointer" />
            </Button>
          </Link>
          <DropdownActions session={item} organizationSlug={organization} />
        </div>
      </TableCell>
    </>
  );
};

export default TableCells;
