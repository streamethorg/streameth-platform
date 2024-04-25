import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IExtendedSession } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import { EllipsisVertical, Loader2 } from 'lucide-react'
import { generateThumbnail } from '@/lib/actions/livepeer'

const VideoCardProcessing = async ({
  session,
}: {
  session: IExtendedSession
}) => {
  const thumbnail = (await generateThumbnail(session)) || ''
  return (
    <div className="w-full min-h-full uppercase rounded-xl animate-pulse">
      <Thumbnail imageUrl={session.coverImage} fallBack={thumbnail} />
      <div className="flex justify-between items-start">
        <CardHeader
          className={`rounded p-1 mt-1 lg:p-2 shadow-none lg:shadow-none `}>
          <CardTitle
            className={`text-sm capitalize line-clamp-2 overflow-hidden`}>
            <div className="flex justify-start items-center space-x-2">
              <Loader2 className="animate-spin" />
              <span>Processing...</span>
            </div>
          </CardTitle>

          <div className="flex justify-between items-center">
            <CardDescription className={`text-xs truncate `}>
              {formatDate(
                new Date(session.createdAt as string),
                'ddd. MMM. D, YYYY'
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <EllipsisVertical className="mt-2" />
      </div>
    </div>
  )
}

export default VideoCardProcessing
