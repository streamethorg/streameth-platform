'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Copy, Eye, FilePenLine, Share2, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import DeleteAsset from '../DeleteAsset';
import { IExtendedSession, eLayout } from '@/lib/types';
import Link from 'next/link';
import { toast } from 'sonner';
import VideoDownloadClient from '@/components/misc/VideoDownloadClient';
import { ShareModalContent } from '@/components/misc/interact/ShareButton';
import GetHashButton from '../GetHashButton';
import VisibilityButton from '../VisibilityButton';

export const PopoverActions = ({
  session,
  organizationSlug,
  layout,
}: {
  session: IExtendedSession;
  organizationSlug: string;
  layout: eLayout;
}): ReactNode => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined') return;
    setUrl(
      `${
        window?.location?.origin
      }/${organizationSlug}/watch?session=${session._id.toString()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(session.ipfsURI as string);
    toast.success('Copied IPFS Hash to your clipboard');
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Link
          href={`/${organizationSlug}/watch?session=${session._id as string}`}
        >
          <Button variant={'ghost'} className="w-full !justify-start space-x-2">
            <Eye className="w-5 h-5" />
            <p className="">View</p>
          </Button>
        </Link>
        <VisibilityButton session={session} />
        {layout === eLayout.grid &&
          (session.ipfsURI ? (
            <Button
              variant={'ghost'}
              className="space-x-2"
              onClick={() => handleCopy()}
            >
              <Copy />
              <p>Copy IPFS Hash</p>
            </Button>
          ) : (
            <GetHashButton session={session} />
          ))}
        <Dialog>
          <DialogTrigger>
            <span
              className={buttonVariants({
                variant: 'ghost',
                className: 'w-full !justify-start space-x-2',
              })}
            >
              <Share2 className="w-5 h-5" />
              <p>Share</p>
            </span>
          </DialogTrigger>
          <ShareModalContent url={url} shareFor="video" />
        </Dialog>
        {session.assetId && (
          <VideoDownloadClient
            className="!justify-start space-x-2"
            videoName={`${session.name}.mp4`}
            variant="ghost"
            assetId={session.assetId}
          />
        )}
        <DeleteAsset
          session={session}
          TriggerComponent={
            <span
              className={buttonVariants({
                variant: 'ghost',
                className:
                  'flex cursor-pointer !justify-start space-x-2 hover:bg-gray-100',
              })}
            >
              <Trash2 className="w-5 h-5 text-destructive" />
              <p>Delete</p>
            </span>
          }
        />
      </div>
    </div>
  );
};
