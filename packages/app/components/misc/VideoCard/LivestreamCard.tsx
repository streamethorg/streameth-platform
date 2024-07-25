import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/time';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { IExtendedStage } from '@/lib/types';

const LivestreamCard = ({
  name,
  thumbnail,
  date,
  showDate = true,
  link,
  DropdownMenuItems,
  livestream,
}: {
  name: string;
  thumbnail: string;
  date: string;
  showDate?: boolean;
  link: string;
  DropdownMenuItems?: React.ReactNode;
  livestream: IExtendedStage;
}) => {
  return (
    <div className="flex min-h-full w-full flex-row space-y-2 rounded-xl uppercase md:flex-col">
      <div className="my-auto w-1/4 flex-none md:w-full">
        <Link href={link}>
          <Thumbnail imageUrl={thumbnail} />
        </Link>
      </div>
      <div className="ml-4 flex-grow md:ml-0">
        <CardHeader className="mt-1 rounded p-1 shadow-none md:px-1 md:py-0 lg:px-1 lg:py-0 lg:shadow-none">
          <Link href={link}>
            <CardTitle className="line-clamp-2 overflow-hidden text-sm capitalize hover:underline">
              {name}
            </CardTitle>
          </Link>
          {showDate && (
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">
                {livestream.isMultipleDate && livestream.streamEndDate
                  ? `${formatDate(
                      new Date(date),
                      'ddd. MMM. D, YYYY, h:mm a'
                    )} - ${formatDate(
                      new Date(livestream.streamEndDate),
                      'ddd. MMM. D, YYYY, h:mm a'
                    )}`
                  : formatDate(new Date(date), 'ddd. MMM. D, YYYY, h:mm a')}
              </CardDescription>
            </div>
          )}
        </CardHeader>
        {DropdownMenuItems && (
          <DropdownMenu>
            <DropdownMenuTrigger className="z-10">
              <EllipsisVertical className="mt-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>{DropdownMenuItems}</DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default LivestreamCard;
