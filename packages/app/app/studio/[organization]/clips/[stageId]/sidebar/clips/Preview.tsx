'use client';

import { useEffect, useState } from 'react';
import Player from '@/components/ui/Player';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import ShareButton from '@/components/misc/interact/ShareButton';
import { deleteSessionAction } from '@/lib/actions/sessions';
import { toast } from 'sonner';
import { Asset } from 'livepeer/models/components';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { IExtendedSession } from '@/lib/types';

const Preview = ({
  isOpen,
  asset,
  organizationId,
  session,
  setIsOpen,
}: {
  isOpen: boolean;
  asset?: Asset | null;
  organizationId: string;
  session: IExtendedSession;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const params = useParams();
  const organizationSlug = params.organization as string;

  useEffect(() => {
    setShareUrl(
      `${window.location.origin}/${organizationSlug}/watch?session=${session._id}`
    );
  }, [organizationSlug, session._id]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = () => {
    deleteSessionAction({
      organizationId,
      sessionId: session._id,
    })
      .then(() => {
        toast.success('Session deleted');
        handleClose();
      })
      .catch(() => {
        toast.error('Error deleting session');
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-4xl bg-transparent text-white">
        <DialogTitle>{session.name}</DialogTitle>
        <div className="space-y-2 p-4">
          <Player
            src={[
              {
                src:
                  (asset?.playbackUrl as '${string}m3u8') ??
                  `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${asset?.playbackId}/index.m3u8`,
                width: 1920,
                height: 1080,
                mime: 'application/vnd.apple.mpegurl',
                type: 'hls',
              },
            ]}
          />

          <DialogFooter className="flex flex-row text-black">
            <Button
              className="mr-auto"
              variant={'destructive'}
              onClick={handleDelete}
            >
              Delete
            </Button>

            <ShareButton url={shareUrl} shareFor="video" />
            <Button variant={'outline'} onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Preview;
