import { TableCell } from '@/components/ui/table';
import { IExtendedSession, eLayout } from '@/lib/types';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/time';
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
import PublishCell from './PublishCell';
import { ClippingStatus } from 'streameth-new-server/src/interfaces/session.interface';

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

  return (
    <>
      <TableCell className="relative max-w-[500px] font-medium">
        <div className="flex w-full flex-row items-center space-x-4">
          <div className="min-w-[100px]">
            <Thumbnail imageUrl={item.coverImage} fallBack={imageUrl} />
          </div>

          <Link href={`library/${item._id}`}>
            <span className="line-clamp-3 hover:underline">{item.name}</span>
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-start space-x-2">
          <PublishCell item={item} />
        </div>
      </TableCell>
      {item.updatedAt && (
        <TableCell className="truncate">
          {formatDate(new Date(item.updatedAt as string), 'ddd. MMM. D, YYYY')}
        </TableCell>
      )}

      <TableCell className="relative max-w-[100px]">{views}</TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger className="z-10">
            <EllipsisVertical className="mt-2" />
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <PopoverActions
              session={item}
              organizationSlug={organization}
              layout={eLayout.list}
            />
          </PopoverContent>
        </Popover>
      </TableCell>
    </>
  );
};

export default TableCells;
