'use client';

import { TableCell } from '@/components/ui/table';
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { formatDate } from '@/lib/utils/time';
import { IExtendedSession } from '@/lib/types';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import DeleteAsset from '../DeleteAsset';
import { Button } from '@/components/ui/button';

const ProcessingSkeleton = ({ item }: { item: IExtendedSession }) => {
  const isPending = item.processingStatus === ProcessingStatus.pending;

  const getStatusClassName = () =>
    isPending ? 'bg-muted cursor-not-allowed opacity-50' : '';
  return (
    <>
      <TableCell className={`relative  font-medium ${getStatusClassName()}`}>
        <div className="flex w-full flex-row items-center space-x-4">
          <div className="min-w-[100px]">
            <AspectRatio ratio={16 / 9}>
              {item.coverImage ? (
                <Image
                  src={item.coverImage}
                  fill
                  alt="Thumbnail Image"
                  quality={50}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <DefaultThumbnail className="max-h-full max-w-full" />
                </div>
              )}
            </AspectRatio>
          </div>

          <span className="line-clamp-3 text-gray-400">{item.name}</span>
        </div>
      </TableCell>
      <TableCell className={`  ${getStatusClassName()}`}>
        {isPending ? (
          <div className="flex items-center  justify-start space-x-2">
            <span>Processing...</span>
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <span className="text-destructive">Processing Failed!</span>
        )}
      </TableCell>
      {item.createdAt && (
        <TableCell className={` truncate ${getStatusClassName()}`}>
          {formatDate(new Date(item.createdAt as string), 'ddd. MMM. D, YYYY')}
        </TableCell>
      )}
      <TableCell className={`relative  ${getStatusClassName()}`}>
        <div className="h-[15px] w-[200px] animate-pulse rounded-md bg-gray-200"></div>
      </TableCell>
      <TableCell className={`  ${getStatusClassName()}`}>
        {!isPending && (
          <DeleteAsset
            session={item}
            TriggerComponent={
              <Button
                variant={'destructive-outline'}
                className="space-x-2 hover:bg-gray-100"
              >
                <Trash2 />
                <p>Delete video</p>
              </Button>
            }
          />
        )}
      </TableCell>
    </>
  );
};

export default ProcessingSkeleton;
