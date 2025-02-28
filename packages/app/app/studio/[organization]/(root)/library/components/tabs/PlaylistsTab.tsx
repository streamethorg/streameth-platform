'use server';

import { CreatePlaylistDialog } from '../CreatePlaylistDialog';
import PlaylistTable, { PlaylistTableSkeleton } from '../PlaylistTable';
import { fetchOrganizationPlaylists } from '@/lib/services/playlistService';

interface PlaylistsTabProps {
  organizationId: string;
}

const PlaylistsTab = async ({ organizationId }: PlaylistsTabProps) => {
  const playlists = await fetchOrganizationPlaylists({ organizationId });

  return (
    <>
      <div className="px-4 mb-4">
        <CreatePlaylistDialog />
      </div>
      <PlaylistTable playlists={playlists} />
    </>
  );
};

export default PlaylistsTab; 