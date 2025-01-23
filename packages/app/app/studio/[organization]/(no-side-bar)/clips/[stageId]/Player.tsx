'use client';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useClipContext } from './ClipContext';
import usePlayer from '@/lib/hooks/usePlayer';

export interface HlsPlayerProps {
  src: string;
  type: string;
}

const ReactHlsPlayer: React.FC<HlsPlayerProps> = ({ src, type }) => {
  const {
    setIsLoading,
    isLoading,
    videoRef,
    setHls,
    playbackStatus,
    setPlaybackStatus,
  } = useClipContext();

  const { currentTime } = usePlayer(videoRef);
  const playbackRef = useRef({ progress: 0, offset: 0 });
  const [error, setError] = useState<string | null>(null);

  // Constants
  const corsProxyUrl = process.env.NEXT_PUBLIC_CORS_PROXY_URL || '';
  const proxyBaseUrl = `${corsProxyUrl}/raw?url=`;
  const proxiedSrc = `${proxyBaseUrl}${encodeURIComponent(src)}`;

  // Helper functions
  const handleFragmentChange = (event: any, data: any) => {
    if (!videoRef.current) return;

    const progress = currentTime;
    const fragmentTime = data.frag.rawProgramDateTime;
    const offset =
      Date.now() -
      (fragmentTime ? new Date(fragmentTime).getTime() : Date.now());
    const newPlaybackStatus = { progress, offset };
    playbackRef.current = newPlaybackStatus;
    setPlaybackStatus(newPlaybackStatus);
  };

  const setupHlsInstance = () => {
    if (!Hls.isSupported() || !videoRef.current) return null;

    const hlsConfig = {
      debug: false,
      xhrSetup: (xhr: XMLHttpRequest, url: string) => {
        if (type === 'youtube') {
          const proxiedUrl = `${proxyBaseUrl}${encodeURIComponent(url)}`;
          xhr.open('GET', proxiedUrl, true);
        }
      },
    };

    const hls = new Hls(hlsConfig);
    setHls(hls);

    hls.loadSource(type === 'youtube' ? proxiedSrc : src);
    hls.attachMedia(videoRef.current);

    // Event listeners
    hls.on(Hls.Events.FRAG_CHANGED, handleFragmentChange);
    hls.on(Hls.Events.ERROR, (event, data) => setError(data.details));

    return hls;
  };

  useEffect(() => {
    const hls = setupHlsInstance();

    if (videoRef.current) {
      videoRef.current.onseeking = () => setIsLoading(true);
      videoRef.current.onseeked = () => setIsLoading(false);
    }

    return () => {
      hls?.destroy();
    };
  }, [proxiedSrc, videoRef, setIsLoading, src]);

  return (
    <div className="relative flex h-2/3 flex-grow aspect-video w-full bg-black">
      <video
        ref={videoRef}
        autoPlay={false}
        controls={false}
        className="sticky top-0 w-full rounded-lg z-30"
      />
      {isLoading && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <div className="h-20 w-20 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
        </div>
      )}
    </div>
  );
};

export default ReactHlsPlayer;
