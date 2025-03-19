'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Eye, Loader2, Share2, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { IExtendedSession } from '@/lib/types';
import Link from 'next/link';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ShareModalContent } from '@/components/misc/interact/ShareButton';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PlaylistDropdownActionsProps {
  session: IExtendedSession;
  onRemove: (sessionId: string) => Promise<void>;
  isRemoving: boolean;
}

const PlaylistDropdownActions = ({
  session,
  onRemove,
  isRemoving,
}: PlaylistDropdownActionsProps) => {
  const params = useParams();
  const { organization } = useOrganization(params.organization as string);
  const [url, setUrl] = useState('');

  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined' || !organization?._id) return;
    setUrl(
      `${window?.location?.origin}/${organization._id}/watch?session=${session._id.toString()}`
    );
  }, [organization?._id, session._id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="w-5 h-5 cursor-pointer" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2 w-52 bg-white rounded-md shadow-md">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Link href={`/${organization?._id}/watch?session=${session._id as string}`}>
              <Button variant="ghost" className="w-full !justify-start space-x-2">
                <Eye className="w-5 h-5" />
                <p>View</p>
              </Button>
            </Link>
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
            <Button
              variant="ghost"
              className="w-full !justify-start space-x-2 hover:bg-gray-100"
              onClick={() => onRemove(session._id?.toString() || '')}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="w-5 h-5 animate-spin text-destructive" />
              ) : (
                <Trash2 className="w-5 h-5 text-destructive" />
              )}
              <p>Remove from Playlist</p>
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlaylistDropdownActions; 