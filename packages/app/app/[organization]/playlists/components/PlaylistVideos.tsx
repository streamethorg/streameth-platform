import { fetchPlaylist } from '@/lib/services/playlistService';
import { fetchSession } from '@/lib/services/sessionService';
import VideoGrid from '@/components/misc/Videos';
import { FileQuestion } from 'lucide-react';
import Pagination from '@/app/studio/[organization]/(root)/library/components/Pagination';
import { IExtendedSession } from '@/lib/types';

interface PlaylistVideosProps {
  organizationId: string;
  playlistId: string;
  page?: number;
  gridLength?: number;
}

interface PlaylistPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export default async function PlaylistVideos({
  organizationId,
  playlistId,
  page = 1,
  gridLength = 12,
}: PlaylistVideosProps) {
  // Fetch the playlist
  const playlist = await fetchPlaylist({
    organizationId,
    playlistId,
  });

  if (!playlist?.sessions?.length) {
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center justify-center">
        <FileQuestion size={65} />
        <span className="bolt mt-2 text-xl">
          No videos in this playlist
        </span>
      </div>
    );
  }

  // Fetch all sessions in the playlist
  const sessionPromises = playlist.sessions.map(sessionId =>
    fetchSession({ session: sessionId.toString() })
  );
  const allSessions = await Promise.all(sessionPromises);
  const sessions = allSessions.filter((session): session is IExtendedSession => session !== null);

  // Calculate pagination
  const startIndex = (page - 1) * gridLength;
  const endIndex = startIndex + gridLength;
  const paginatedSessions = sessions.slice(startIndex, endIndex);

  const pagination: PlaylistPagination = {
    currentPage: page,
    totalPages: Math.ceil(sessions.length / gridLength),
    totalItems: sessions.length,
    limit: gridLength,
  };

  if (paginatedSessions.length === 0) {
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center justify-center">
        <FileQuestion size={65} />
        <span className="bolt mt-2 text-xl">
          No videos found on this page
        </span>
      </div>
    );
  }

  return (
    <>
      <VideoGrid videos={paginatedSessions} />
      {pagination.totalPages > 1 && <Pagination {...pagination} />}
    </>
  );
} 