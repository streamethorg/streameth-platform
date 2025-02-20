'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';
import { formatDate } from '@/lib/utils/time';
import { Button } from '@/components/ui/button';
import { FilePenLine, Loader2, Trash } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { CreatePlaylistDialog } from './CreatePlaylistDialog';
import { deletePlaylistAction } from '@/lib/actions/playlists';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface PlaylistTableProps {
  playlists: Array<IPlaylist & { createdAt: string }>;
}

const PlaylistTable = ({ playlists }: PlaylistTableProps) => {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<IPlaylist | null>(null);

  const handleDelete = async () => {
    if (!playlistToDelete?._id) return;

    setIsDeleting(true);
    try {
      await deletePlaylistAction({
        organizationId: params.organization as string,
        playlistId: playlistToDelete._id.toString(),
      });
      toast.success('Playlist deleted successfully');
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete playlist';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setPlaylistToDelete(null);
    }
  };

  if (!playlists || playlists.length === 0) {
    return (
      <div className="bg-white rounded-xl mx-4 my-2 border h-[calc(100%-90px)] flex items-center justify-center">
        <p className="text-muted-foreground">No playlists created yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl mx-4 my-2 border h-[calc(100%-90px)]">
        <Table className="bg-white">
          <TableHeader className="sticky top-0 z-10 bg-white rounded-t-xl">
            <TableRow className="hover:bg-white rounded-t-xl">
              <TableHead>Title</TableHead>
              <TableHead>Videos</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {playlists.map((playlist) => (
              <TableRow key={playlist._id?.toString()}>
                <TableCell className="p-2 md:p-2 relative font-medium max-w-[300px] h-20">
                  <div className="flex flex-row items-center space-x-4 w-full h-full max-w-[500px]">
                    <div className="min-w-[100px]">
                      <Thumbnail />
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/studio/${params.organization}/library/playlists/${playlist._id}`}>
                        <span className="hover:underline line-clamp-2">
                          {playlist.name}
                        </span>
                      </Link>
                      {playlist.description && (
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {playlist.description}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {playlist.sessions.length} video{playlist.sessions.length !== 1 ? 's' : ''}
                </TableCell>
                <TableCell>
                  <span className={playlist.isPublic ? 'text-green-500' : 'text-yellow-500'}>
                    {playlist.isPublic ? 'Public' : 'Private'}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDate(new Date(playlist.createdAt), 'ddd. MMM. D, YYYY')}
                </TableCell>
                <TableCell className="w-[220px]">
                  <div className="flex justify-between items-center gap-2 relative">
                    <CreatePlaylistDialog
                      playlist={playlist}
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 h-8"
                        >
                          <FilePenLine className="w-4 h-4" />
                          <span>Edit</span>
                        </Button>
                      }
                    />
                    <Button
                      size="sm"
                      variant="destructiveOutline"
                      className="flex items-center gap-2 h-8"
                      onClick={() => setPlaylistToDelete(playlist)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="w-4 h-4" />
                      )}
                      <span>Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!playlistToDelete} onOpenChange={() => setPlaylistToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the playlist "{playlistToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const PlaylistTableSkeleton = () => {
  return (
    <div className="bg-white rounded-xl mx-4 my-2 border h-[calc(100%-90px)]">
      <Table className="bg-white">
        <TableHeader className="sticky top-0 z-10 bg-white rounded-t-xl">
          <TableRow className="hover:bg-white rounded-t-xl">
            <TableHead>Title</TableHead>
            <TableHead>Videos</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-auto">
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell className="p-2 md:p-2 relative font-medium max-w-[300px] h-20">
                <div className="flex flex-row items-center space-x-4 w-full h-full max-w-[500px]">
                  <div className="min-w-[100px] bg-gray-200 animate-pulse aspect-video rounded-lg" />
                  <div className="flex flex-col space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-32" />
              </TableCell>
              <TableCell>
                <div className="flex justify-between items-center gap-2">
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-20" />
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-20" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlaylistTable; 