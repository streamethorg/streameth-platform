import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IExtendedSession } from '@/lib/types';
import { formatDate } from '@/lib/utils/time';
import { EllipsisVertical, Loader2 } from 'lucide-react';
import { generateThumbnailAction } from '@/lib/actions/sessions';

const VideoCardProcessing = async ({
  session,
}: {
  session: IExtendedSession;
}) => {
  const thumbnail = (await generateThumbnailAction(session)) || '';

  return (
    <div className="min-h-full w-full animate-pulse rounded-xl uppercase">
      <Thumbnail imageUrl={session.coverImage} fallBack={thumbnail} />
      <div className="flex items-start justify-between">
        <CardHeader
          className={`mt-1 rounded p-1 shadow-none lg:p-2 lg:shadow-none`}
        >
          <CardTitle
            className={`line-clamp-2 overflow-hidden text-sm capitalize`}
          >
            <div className="flex items-center justify-start space-x-2">
              <Loader2 className="animate-spin" />
              <span>Processing...</span>
            </div>
          </CardTitle>

          <div className="flex items-center justify-between">
            <CardDescription className={`truncate text-xs`}>
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
  );
};

export default VideoCardProcessing;
