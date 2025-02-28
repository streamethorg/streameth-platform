'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Eye, Share2, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import DeleteAsset from './DeleteAsset';
import { IExtendedSession } from '@/lib/types';
import Link from 'next/link';
import VideoDownloadClient from '@/components/misc/VideoDownloadClient';
import { ShareModalContent } from '@/components/misc/interact/ShareButton';
import VisibilityButton from './VisibilityButton';
import { useOrganization } from '@/lib/hooks/useOrganization';
import AddToPlaylistMenu from './AddToPlaylistMenu';
import { fetchOrganizationPlaylists } from '@/lib/services/playlistService';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';
import { useParams } from 'next/navigation';

const DropdownActions = ({
  session,
  asButton,
}: {
  session: IExtendedSession;
  asButton?: boolean;
}) => {
  const params = useParams();
  const { organization } = useOrganization(params.organization as string);
  const [url, setUrl] = useState('');
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!organization?._id) return;
      try {
        const data = await fetchOrganizationPlaylists({ organizationId: organization._id });
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, [organization?._id]);

  useEffect(() => {
    // This code will only run on the client side
    if (typeof window === 'undefined' || !organization?._id) return;
    setUrl(
      `${
        window?.location?.origin
      }/${organization._id}/watch?session=${session._id.toString()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?._id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {asButton ? (
          <Button variant="outline" className=" space-x-2">
            <p>Actions</p>
            <EllipsisVertical className="w-5 h-5" />
          </Button>
        ) : (
          <EllipsisVertical className="w-5 h-5 cursor-pointer" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2 w-52 bg-white rounded-md shadow-md">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Link
              href={`/${organization?._id}/watch?session=${session._id as string}`}
            >
              <Button
                variant={'ghost'}
                className="w-full !justify-start space-x-2"
              >
                <Eye className="w-5 h-5" />
                <p className="">View</p>
              </Button>
            </Link>
            <VisibilityButton session={session} />
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
            <AddToPlaylistMenu sessionId={session._id.toString()} playlists={playlists} />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActions;
