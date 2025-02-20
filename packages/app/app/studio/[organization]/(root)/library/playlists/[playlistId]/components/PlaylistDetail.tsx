'use client';

import { Button } from '@/components/ui/button';
import { IExtendedSession } from '@/lib/types';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';
import { CreatePlaylistDialog } from '../../../components/CreatePlaylistDialog';
import { FilePenLine, Globe, Lock } from 'lucide-react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils/time';
import { updatePlaylistAction } from '@/lib/actions/playlists';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import PlaylistTableCells from './PlaylistTableCells';

interface PlaylistDetailProps {
  playlist: IPlaylist & { createdAt: string };
  sessions: IExtendedSession[];
}

const PlaylistDetail = ({ playlist, sessions }: PlaylistDetailProps) => {
  const router = useRouter();
  const { organizationId } = useOrganizationContext();
  const [removingSessionId, setRemovingSessionId] = useState<string | null>(null);

  const handleRemoveFromPlaylist = async (sessionId: string) => {
    try {
      setRemovingSessionId(sessionId);
      
      // Filter out the session from the playlist's sessions and convert to strings
      const updatedSessions = playlist.sessions
        .filter(id => id.toString() !== sessionId)
        .map(id => id.toString());

      await updatePlaylistAction({
        organizationId,
        playlistId: playlist._id?.toString() || '',
        playlist: {
          sessions: updatedSessions,
        },
      });

      toast.success('Video removed from playlist');
      router.refresh();
    } catch (error) {
      toast.error('Failed to remove video from playlist');
    } finally {
      setRemovingSessionId(null);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header Section */}
      <div className="bg-white border-b w-full flex-none">
        <div className="w-full px-6 py-4">
          <div className="flex items-start justify-between w-full">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{playlist.name}</h1>
                {playlist.isPublic ? (
                  <Globe className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              {playlist.description && (
                <p className="text-muted-foreground max-w-2xl">
                  {playlist.description}
                </p>
              )}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Created {formatDate(new Date(playlist.createdAt), 'MMM D, YYYY')}</span>
                <span>{sessions.length} video{sessions.length !== 1 ? 's' : ''}</span>
                <span className={playlist.isPublic ? 'text-green-500' : 'text-yellow-500'}>
                  {playlist.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
            <CreatePlaylistDialog
              playlist={playlist}
              trigger={
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FilePenLine className="w-4 h-4" />
                  <span>Edit Playlist</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-gray-50 w-full overflow-auto">
        <div className="w-full p-6">
          <div className="bg-white rounded-lg border shadow-sm w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Videos</h2>
              <span className="text-sm text-muted-foreground">
                {sessions.length} video{sessions.length !== 1 ? 's' : ''} in playlist
              </span>
            </div>
            <div className="w-full">
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center w-full">
                  <p className="text-muted-foreground mb-2">No videos in this playlist yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add videos to this playlist from the library or video pages
                  </p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Created at</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[220px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session._id}>
                          <PlaylistTableCells 
                            item={session} 
                            onRemove={handleRemoveFromPlaylist}
                            isRemoving={removingSessionId === session._id?.toString()}
                          />
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail; 