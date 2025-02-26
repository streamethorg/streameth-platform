'use server';

import { IExtendedSession } from '@/lib/types';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';
import { getVideoUrlAction } from '@/lib/actions/livepeer';
import PlaylistVideoPlayer from './PlaylistVideoPlayer';

interface PlaylistVideoProps {
  playlist: IPlaylist;
  sessions: IExtendedSession[];
  currentVideo: IExtendedSession;
  organizationName: string;
  organizationLogo: string;
  organizationId: string;
}

export default async function PlaylistVideo({
  playlist,
  sessions,
  currentVideo,
  organizationName,
  organizationLogo,
  organizationId,
}: PlaylistVideoProps) {
  // Fallback to a direct videoUrl if it exists on the session
  let videoUrl: string | null = null;
  
  try {
    // First try using the existing videoUrl if it's a direct playable URL
    if (currentVideo.videoUrl && 
        (currentVideo.videoUrl.endsWith('.mp4') || 
         currentVideo.videoUrl.includes('.m3u8'))) {
      videoUrl = currentVideo.videoUrl;
      console.log("Using direct video URL:", videoUrl);
    } 
    // Otherwise try to get it via the action
    else {
      videoUrl = await getVideoUrlAction(currentVideo);
      console.log("Fetched video URL via action:", videoUrl);
    }
    
    if (!videoUrl) {
      console.log("No video URL available for:", currentVideo.name);
      return (
        <div className="p-6 bg-white rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Video Not Available</h2>
          <p className="text-muted-foreground">
            The video URL for "{currentVideo.name}" could not be retrieved. It may be processing or unavailable.
          </p>
        </div>
      );
    }
  } catch (error) {
    console.error("Error fetching video URL:", error);
    
    return (
      <div className="p-6 bg-white rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Video</h2>
        <p className="text-muted-foreground">
          There was a problem loading the video. Please try again later.
        </p>
      </div>
    );
  }

  console.log("Rendering PlaylistVideoPlayer with URL:", videoUrl);

  return (
    <PlaylistVideoPlayer
      playlist={playlist}
      sessions={sessions}
      currentVideo={currentVideo}
      videoUrl={videoUrl}
      organizationName={organizationName}
      organizationLogo={organizationLogo}
      organizationId={organizationId}
    />
  );
} 