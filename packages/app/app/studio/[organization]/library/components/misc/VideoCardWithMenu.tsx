'use client';

import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IExtendedSession } from '@/lib/types';
import { formatDate } from '@/lib/utils/time';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useGenerateThumbnail from '@/lib/hooks/useGenerateThumbnail';

const VideoCardWithMenu = ({
  session,
  showDate = true,
  DropdownMenuItems,
  link,
}: {
  session: IExtendedSession;
  showDate?: boolean;
  DropdownMenuItems?: ReactNode;
  link: string;
}) => {
  const thumbnail = useGenerateThumbnail({ session });

  return (
    <div className="flex min-h-full w-full flex-col rounded-xl uppercase">
      <Link className="h-full w-full" href={link}>
        <Thumbnail imageUrl={session.coverImage} fallBack={thumbnail} />
      </Link>
      <div className="flex items-start justify-between">
        <CardHeader
          className={`mt-1 rounded p-1 shadow-none lg:p-2 lg:shadow-none`}
        >
          <Link target="_blank" rel="noopener" href={link}>
            <CardTitle
              className={`line-clamp-2 overflow-hidden text-sm capitalize hover:underline`}
            >
              {session.name}
            </CardTitle>
          </Link>
          {showDate && (
            <div className="flex items-center justify-between">
              <CardDescription className={`truncate text-xs`}>
                {formatDate(
                  new Date(session.updatedAt as string),
                  'ddd. MMM. D, YYYY'
                )}
              </CardDescription>
            </div>
          )}
        </CardHeader>

        {DropdownMenuItems && (
          <Popover>
            <PopoverTrigger className="z-10">
              <EllipsisVertical className="mt-2" />
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              {DropdownMenuItems}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default VideoCardWithMenu;
