'use server';

import { notFound } from 'next/navigation';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';
import { IExtendedSession } from '@/lib/types';
import PlaylistVideoPlayer from './PlaylistVideoPlayer';
import { PlayerWithControls } from '@/components/ui/Player';
import { Src } from '@livepeer/react';
import { getVideoUrlAction } from '@/lib/actions/livepeer';

interface PlaylistVideoProps {
  playlist: IPlaylist;
  sessions: IExtendedSession[];
  currentVideo: IExtendedSession;
  organizationName: string;
  organizationLogo: string;
  organizationId: string;
}

// This is a server component that fetches the videoUrl and passes it to the client component
export default async function PlaylistVideo({
  playlist,
  sessions,
  currentVideo,
  organizationName,
  organizationLogo,
  organizationId,
}: PlaylistVideoProps) {
  // Fetch the video URL from the server
  const videoUrl = await getVideoUrlAction(currentVideo);
  
  if (!videoUrl) {
    return notFound();
  }
  
  // Create Src array for PlayerWithControls
  const playerSrc: Src[] = [
    {
      src: videoUrl as `${string}m3u8`,
      width: 1920,
      height: 1080,
      mime: 'application/vnd.apple.mpegurl',
      type: 'hls',
    },
  ];

  return (
    <PlaylistVideoPlayer
      playlist={playlist}
      sessions={sessions}
      currentVideo={currentVideo}
      videoUrl={videoUrl}
      organizationName={organizationName}
      organizationLogo={organizationLogo}
      organizationId={organizationId}
      playerSrc={playerSrc}
    />
  );
} 