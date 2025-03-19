'use client';

import { PlayIcon } from 'lucide-react';
import Link from 'next/link';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';
import { useEffect, useState } from 'react';
import PlaylistShareDialog from './PlaylistShareDialog';

interface PlaylistCardProps {
  playlist: IPlaylist;
  organizationId: string;
}

export default function PlaylistCard({ playlist, organizationId }: PlaylistCardProps) {
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${window.location.origin}/${organizationId}/playlists/${playlist._id}`);
    }
  }, [organizationId, playlist._id]);

  return (
    <div className="group relative">
      <Link
        href={`/${organizationId}/playlists/${playlist._id}`}
        className="block"
      >
        <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:border-primary hover:shadow-sm pr-14">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PlayIcon size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 font-semibold group-hover:text-primary">
              {playlist.name}
            </h3>
            {playlist.description && (
              <p className="line-clamp-1 text-sm text-muted-foreground mt-0.5">
                {playlist.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {playlist.sessions?.length} {playlist.sessions?.length === 1 ? 'video' : 'videos'}
            </p>
          </div>
        </div>
      </Link>
      <div className="absolute right-3 top-1/2 -translate-y-1/2" onClick={(e) => e.stopPropagation()}>
        <PlaylistShareDialog url={fullUrl} />
      </div>
    </div>
  );
} 