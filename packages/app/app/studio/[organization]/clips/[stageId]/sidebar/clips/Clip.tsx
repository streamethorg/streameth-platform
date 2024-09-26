'use client';
import { Card, CardContent } from '@/components/ui/card';
import { IExtendedSession } from '@/lib/types';
import { formatDate } from '@/lib/utils/time';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { useEffect, useState } from 'react';
import Preview from './Preview';
import { Asset } from 'livepeer/models/components';
import { fetchAsset } from '@/lib/services/sessionService';
import useGenerateThumbnail from '@/lib/hooks/useGenerateThumbnail';

export default function Clip({ session }: { session: IExtendedSession }) {
  const { name, coverImage, assetId } = session;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const thumbnail = useGenerateThumbnail({ session });

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.status?.phase]);
  if (!assetId) return null;

  return (
    <>
      <div>
        {asset?.status?.phase === 'processing' ? (
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
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round(Number(asset?.status?.progress ?? 0) * 100)}%
                    complete.
                  </p>
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
