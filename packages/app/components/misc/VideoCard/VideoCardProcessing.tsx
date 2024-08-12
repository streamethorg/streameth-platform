import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IExtendedSession } from '@/lib/types';
import { formatDate } from '@/lib/utils/time';
import { EllipsisVertical, Loader2 } from 'lucide-react';
import useGenerateThumbnail from '@/lib/hooks/useGenerateThumbnail';
import { ClippingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import DeleteAsset from '@/app/studio/[organization]/library/components/DeleteAsset';
import { Button } from '@/components/ui/button';
import { LuTrash2 } from 'react-icons/lu';

const VideoCardProcessing = async ({
  session,
}: {
  session: IExtendedSession;
}) => {
  const thumbnail = useGenerateThumbnail({ session });
  const isPending = session.clippingStatus === ClippingStatus.pending;

  return (
    <div
      className={`min-h-full w-full rounded-xl uppercase ${isPending ? 'animate-pulse' : ''}`}
    >
      <Thumbnail imageUrl={session.coverImage} fallBack={thumbnail} />
      <div className="flex items-start justify-between">
        <CardHeader
          className={`mt-1 rounded p-1 shadow-none lg:p-2 lg:shadow-none`}
        >
          <CardTitle className={`overflow-hidden text-sm capitalize`}>
            {isPending ? (
              <div className="flex items-center justify-start space-x-2">
                <Loader2 className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="">
                <span className="text-destructive mr-2">
                  Processing Failed!
                </span>
                <DeleteAsset
                  session={session}
                  TriggerComponent={
                    <Button variant={'destructive'} className="p-2 space-x-1 ">
                      <LuTrash2 />
                      <p className="text-sm">Delete video</p>
                    </Button>
                  }
                />
              </div>
            )}
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

        {isPending && <EllipsisVertical className="mt-2" />}
      </div>
    </div>
  );
};

export default VideoCardProcessing;
