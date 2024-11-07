'use client';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { Card, CardContent } from '@/components/ui/card';
import useGenerateThumbnail from '@/lib/hooks/useGenerateThumbnail';
import { fetchAsset } from '@/lib/services/sessionService';
import { IExtendedSession } from '@/lib/types';
import { formatDate } from '@/lib/utils/time';
import { Asset } from 'livepeer/models/components';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import Preview from './Preview';

export default function Clip({ session }: { session: IExtendedSession }) {
  const { name, coverImage, assetId } = session;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const thumbnail = useGenerateThumbnail({ session });
  const router = useRouter();
  const getAsset = async () => {
    if (assetId) {
      const asset = await fetchAsset({
        assetId: assetId,
      });
      setAsset(asset);
    }
  };

  useEffect(() => {
    getAsset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId]);

  useEffect(() => {
    if (asset?.status?.phase === 'processing') {
      const interval = setInterval(() => {
        getAsset();
      }, 10000);
      return () => clearInterval(interval);
    } else if (session.processingStatus === ProcessingStatus.pending) {
      const interval = setInterval(() => {
        router.refresh();
      }, 10000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.status?.phase]);

  return (
    <>
      <div>
        {asset?.status?.phase === 'processing' ||
        session.processingStatus === ProcessingStatus.pending ? (
          <Card className="w-full cursor-not-allowed animate-pulse max-w-2xl overflow-hidden px-2 py-1 shadow-none bg-muted">
            <div className="flex justify-center items-center">
              <div className="flex-shrink-0 w-1/3">
                <Thumbnail imageUrl={coverImage} fallBack={thumbnail} />
              </div>
              <CardContent className="lg:p-2 p-2 flex-grow">
                <h2 className="text-lg font-semibold line-clamp-1">{name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Video is processing...
                </p>
                <div className="flex items-center justify-between gap-2">
                  {asset?.status?.phase === 'processing' && (
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round(Number(asset?.status?.progress ?? 0) * 100)}%
                      complete.
                    </p>
                  )}
                  <p className="text-[11px] text-gray-500 mt-1">
                    {formatDate(
                      new Date(session.createdAt as string),
                      'ddd. MMM. D, YYYY'
                    )}
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        ) : session.processingStatus === ProcessingStatus.failed ? (
          <div>
            <Card className="w-full cursor-not-allowed border border-destructive max-w-2xl overflow-hidden px-2 py-1 shadow-none bg-muted">
              <div className="flex justify-center items-center">
                <div className="flex-shrink-0 w-1/3">
                  <Thumbnail imageUrl={coverImage} fallBack={thumbnail} />
                </div>
                <CardContent className="lg:p-2 p-2 flex-grow">
                  <h2 className="text-lg font-semibold line-clamp-1">{name}</h2>
                  <p className="text-sm text-destructive mt-1">
                    Video processing failed
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-gray-500 mt-1">
                      {formatDate(
                        new Date(session.createdAt as string),
                        'ddd. MMM. D, YYYY'
                      )}
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        ) : (
          <Card
            onClick={() => setIsOpen(true)}
            className="w-full max-w-2xl overflow-hidden p-2 shadow-none cursor-pointer hover:bg-gray-100"
          >
            <div className="flex justify-center items-center">
              <div className="flex-shrink-0 w-1/3">
                <Thumbnail imageUrl={coverImage} fallBack={thumbnail} />
              </div>
              <CardContent className="lg:p-2 p-2 flex-grow">
                <h2 className="text-lg font-semibold line-clamp-1">{name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(
                    new Date(session.createdAt as string),
                    'ddd. MMM. D, YYYY'
                  )}
                </p>
              </CardContent>
            </div>
          </Card>
        )}
      </div>

      {isOpen && asset && (
        <Preview
          isOpen={isOpen}
          // asset={asset}
          organizationId={session.organizationId as string}
          session={session}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}
