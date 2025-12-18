'use client';

import { IExtendedSession } from '@/lib/types';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';
import { cn } from '@/lib/utils/utils';
import { CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { formatDate } from '@/lib/utils/time';
import { FileQuestion, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlayerWithControls } from '@/components/ui/Player';
import { Src } from '@livepeer/react';
import ShareButton from '@/components/misc/interact/ShareButton';
import VideoDownloadClient from '@/components/misc/VideoDownloadClient';

interface PlaylistVideoPlayerProps {
  playlist: IPlaylist;
  sessions: IExtendedSession[];
  currentVideo: IExtendedSession;
  videoUrl: string;
  organizationName: string;
  organizationLogo: string;
  organizationId: string;
  playerSrc: Src[];
}

export default function PlaylistVideoPlayer({
  playlist,
  sessions,
  currentVideo,
  videoUrl,
  organizationName,
  organizationLogo,
  organizationId,
  playerSrc,
}: PlaylistVideoPlayerProps) {
  const router = useRouter();
  
  // Handle click on a playlist item
  const handleVideoSelect = (videoId: string) => {
    // Prevent unnecessary URL updates if selecting the same video
    if (currentVideo._id.toString() === videoId) {
      return;
    }
    
    // Use direct navigation
    router.push(`/${organizationId}/playlists/${playlist._id}?video=${videoId}`, 
      { scroll: false });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* Main video section - takes 70% on desktop */}
      <div className="w-full lg:w-8/12 flex-shrink-0 flex flex-col">
        {/* Video display */}
        <div className="flex-1 flex flex-col">
          {/* Use PlayerWithControls instead of custom video element */}
          <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
            <PlayerWithControls
              src={playerSrc}
              name={currentVideo.name}
              thumbnail={currentVideo.coverImage}
            />
          </div>

          <div className="p-4 bg-white rounded-b-lg flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
              <CardTitle className="flex-1">{currentVideo?.name || 'Video'}</CardTitle>
              <div className="flex flex-row space-x-2 md:ml-4">
                <ShareButton shareFor="video" />
                {currentVideo?.assetId && (
                  <VideoDownloadClient
                    variant="outline"
                    videoName={`${currentVideo.name}.mp4`}
                    assetId={currentVideo.assetId}
                  />
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-3">
                <Link href={`/${organizationId}`} className="block">
                  <div className="w-12 h-12 rounded-full bg-gray-200 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                    {/* Simplified image loading with fallback */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      {organizationName?.charAt(0) || '?'}
                    </div>
                    {organizationLogo && (
                      <Image
                        className="rounded-full z-10 relative"
                        width={50}
                        height={50}
                        alt={organizationName}
                        src={organizationLogo}
                        onError={() => console.log("Logo failed to load")}
                      />
                    )}
                  </div>
                </Link>
                <div className="flex flex-col">
                  <Link href={`/${organizationId}`} className="hover:underline">
                    <p className="font-medium">{organizationName}</p>
                  </Link>
                  <p className="text-[12px] text-muted-foreground">
                    Created {formatDate(new Date(currentVideo?.createdAt || Date.now()), 'ddd. MMM. D, YYYY')}
                  </p>
                </div>
              </div>
            </div>
            {currentVideo?.description && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {currentVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playlist sidebar - takes 30% on desktop */}
      <div className="w-full lg:w-4/12 bg-white rounded-lg border shadow-sm flex flex-col h-[600px]">
        <div className="flex justify-between items-center px-4 py-3 bg-white border-b z-10 sticky top-0">
          <h2 className="text-lg font-semibold">{playlist.name}</h2>
          <span className="text-sm text-muted-foreground">
            {sessions.length} video{sessions.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FileQuestion size={40} />
              <p className="text-sm text-muted-foreground mt-2">No videos in this playlist</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div 
                key={session._id.toString()} 
                className={cn(
                  "flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors",
                  currentVideo._id.toString() === session._id.toString() && "bg-gray-100"
                )}
                onClick={() => handleVideoSelect(session._id.toString())}
              >
                <div className="relative min-w-[120px] w-[120px] aspect-video rounded-lg overflow-hidden">
                  {/* Display thumbnail image or fallback */}
                  {session.coverImage ? (
                    <Image
                      src={session.coverImage}
                      alt={session.name || "Video thumbnail"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <FileQuestion className="text-gray-400" size={24} />
                    </div>
                  )}
                  {currentVideo._id.toString() === session._id.toString() && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <Play className="text-white" size={24} fill="white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium line-clamp-2",
                    currentVideo._id.toString() === session._id.toString() && "font-bold"
                  )}>
                    {session.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(new Date(session.createdAt || Date.now()), 'MMM D, YYYY')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 