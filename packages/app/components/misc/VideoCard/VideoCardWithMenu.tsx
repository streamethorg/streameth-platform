'use client';

import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { generateThumbnailAction } from '@/lib/actions/sessions';
import { IExtendedSession } from '@/lib/types';
import { formatDate } from '@/lib/utils/time';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode, useMemo } from 'react';
import { useEffect, useState } from 'react';

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
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const memoizedSession = useMemo(() => session, []);
  useEffect(() => {
    const getThumbnail = async (session: IExtendedSession) => {
      try {
        const generatedThumbnail = await generateThumbnailAction(session);
        setThumbnail(generatedThumbnail);
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
      }
    };

    if (memoizedSession && !memoizedSession.coverImage) {
      getThumbnail(memoizedSession);
    }
  }, [memoizedSession]);

  return (
    <div className="flex min-h-full w-full flex-col rounded-xl uppercase">
      <Link className="h-full w-full" href={link}>
        <Thumbnail imageUrl={session.coverImage} fallBack={thumbnail} />
      </Link>
      <div className="flex items-start justify-between">
        <CardHeader
          className={`mt-1 rounded p-1 shadow-none lg:p-2 lg:shadow-none`}
        >
          <Link href={link}>
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
                  new Date(session.createdAt as string),
                  'ddd. MMM. D, YYYY'
                )}
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

export default VideoCardWithMenu;
