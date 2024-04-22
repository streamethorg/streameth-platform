import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'

import { IExtendedSession } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import { XCircle } from 'lucide-react'
import React from 'react'

const SelectedMediaItem = ({
  video,
  handleRemoveSelected,
}: {
  handleRemoveSelected: (video: IExtendedSession) => void
  video: IExtendedSession
}) => {
  return (
    <div className="mt-4 relative">
      <div
        className="absolute z-50 end-0 p-2 cursor-pointer"
        onClick={() => handleRemoveSelected(video)}>
        <XCircle className="fill-muted-foreground text-white w-7 h-7" />
      </div>
      {video.coverImage ? (
        <Thumbnail imageUrl={video.coverImage} />
      ) : (
        <DefaultThumbnail />
      )}
      <div className="flex justify-between items-start">
        <CardHeader
          className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none `}>
          <CardTitle
            className={`text-sm capitalize line-clamp-1 overflow-hidden `}>
            {video.name}
          </CardTitle>

          <div className="flex justify-between items-center">
            <CardDescription className={`text-xs truncate `}>
              {formatDate(
                new Date(video.createdAt as string),
                'ddd. MMM. D, YYYY'
              )}
            </CardDescription>
          </div>
        </CardHeader>
      </div>
    </div>
  )
}

export default SelectedMediaItem
