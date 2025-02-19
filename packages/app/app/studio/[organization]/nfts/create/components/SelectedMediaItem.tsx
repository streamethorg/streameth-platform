'use client';
import { useEffect, useState } from 'react';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IExtendedSession } from '@/lib/types';
import { formatDate } from '@/lib/utils/time';
import { XCircle } from 'lucide-react';
import React from 'react';

const SelectedMediaItem = ({
  video,
  handleRemoveSelected,
}: {
  handleRemoveSelected: (video: IExtendedSession) => void;
  video: IExtendedSession;
}) => {
  return (
    <div className="relative mt-4">
      <div
        className="absolute end-0 z-50 cursor-pointer p-2"
        onClick={() => handleRemoveSelected(video)}
      >
        <XCircle className="h-7 w-7 fill-muted-foreground text-white" />
      </div>

      <div className="overflow-hidden">
        <Thumbnail imageUrl={video.coverImage} />
      </div>
      <div className="flex items-start justify-between">
        <CardHeader
          className={`mt-1 rounded p-1 shadow-none lg:p-2 lg:shadow-none`}
        >
          <CardTitle
            className={`line-clamp-1 overflow-hidden text-sm capitalize`}
          >
            {video.name}
          </CardTitle>

          <div className="flex items-center justify-between">
            <CardDescription className={`truncate text-xs`}>
              {formatDate(
                new Date(video.createdAt as string),
                'ddd. MMM. D, YYYY'
              )}
            </CardDescription>
          </div>
        </CardHeader>
      </div>
    </div>
  );
};

export default SelectedMediaItem;
