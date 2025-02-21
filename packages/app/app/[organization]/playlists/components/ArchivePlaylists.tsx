import { fetchOrganizationPlaylists } from '@/lib/services/playlistService';
import PlaylistCard from './PlaylistCard';

export function PlaylistSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export default async function ArchivePlaylists({
  organizationId,
  gridLength,
}: {
  organizationId: string;
  gridLength: number;
}) {
  const playlists = await fetchOrganizationPlaylists({ organizationId });
  
  // Filter playlists to only show public playlists with videos
  const publicPlaylistsWithVideos = playlists?.filter(playlist => 
    playlist.isPublic && (playlist.sessions?.length || 0) > 0
  ) || [];

  if (!publicPlaylistsWithVideos.length) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        No playlists found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {publicPlaylistsWithVideos.map((playlist) => (
        <PlaylistCard
          key={playlist._id?.toString()}
          playlist={playlist}
          organizationId={organizationId}
        />
      ))}
    </div>
  );
} 