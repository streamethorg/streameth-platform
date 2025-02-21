import { fetchOrganizationPlaylists } from '@/lib/services/playlistService';
import Link from 'next/link';

export function PlaylistSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
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
  
  // Filter playlists to only show those with videos
  const playlistsWithVideos = playlists?.filter(playlist => (playlist.sessions?.length || 0) > 0) || [];

  if (!playlistsWithVideos.length) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        No playlists found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {playlistsWithVideos.map((playlist) => (
        <Link
          href={`/${organizationId}/playlists/${playlist._id}`}
          key={playlist._id?.toString() || ''}
        >
          <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
            <div className="aspect-video bg-muted" />
            <div className="p-4">
              <h3 className="line-clamp-1 font-semibold">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground">
                {playlist.sessions?.length || 0} videos
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 