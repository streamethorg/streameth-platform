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
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { IExtendedSession } from '@/lib/types';
import VideoDownloadClient from '@/components/misc/VideoDownloadClient';
import Link from 'next/link';
import { useClipsSidebar } from '@/app/studio/[organization]/(no-side-bar)/clips/[stageId]/sidebar/clips/ClipsContext';
const Preview = ({
  isOpen,
  organizationId,
  session,
  setIsOpen,
}: {
  isOpen: boolean;
  organizationId: string;
  session: IExtendedSession;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const params = useParams();
  const organizationSlug = params?.organization as string;
  const { fetchSessions } = useClipsSidebar();
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
        fetchSessions();
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
                  (session?.videoUrl as '${string}m3u8') ??
                  `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${session?.playbackId}/index.m3u8`,
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
            <VideoDownloadClient
              className="space-x-1 border"
              variant={'outline'}
              videoName={session.name}
              assetId={session.assetId}
              collapsable={true}
            />
            <Link 
              href={`/studio/${organizationSlug}/library/${session._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant={'outline'}>Go to Session</Button>
            </Link>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Preview;
