'use server';

import { fetchPlaylist } from '@/lib/services/playlistService';
import { fetchSession } from '@/lib/services/sessionService';
import { notFound } from 'next/navigation';
import PlaylistDetail from './components/PlaylistDetail';

const PlaylistDetailPage = async ({
  params,
}: {
  params: { organization: string; playlistId: string };
}) => {
  // Fetch the playlist with its sessions
  const playlist = await fetchPlaylist({
    organizationId: params.organization,
    playlistId: params.playlistId,
  }).catch(() => null);

  if (!playlist) {
    notFound();
  }

  // Fetch each session in the playlist
  const sessionsPromises = playlist.sessions.map(id => 
    fetchSession({ session: id.toString() })
  );
  const sessions = (await Promise.all(sessionsPromises)).filter((session): session is NonNullable<typeof session> => session !== null);

  return (
    <div className="w-full h-full">
      <PlaylistDetail playlist={playlist} sessions={sessions} />
    </div>
  );
};

export default PlaylistDetailPage; 