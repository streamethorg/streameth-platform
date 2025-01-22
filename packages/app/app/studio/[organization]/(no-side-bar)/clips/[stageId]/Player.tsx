'use client';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useClipContext } from './ClipContext';

export interface HlsPlayerProps {
  src: string;
  type: string;
}

const ReactHlsPlayer: React.FC<HlsPlayerProps> = ({ src, type }) => {
  const {
    setPlaybackStatus,
    setIsLoading,
    isLoading,
    videoRef,
    setHls,
    setTimeReference,
    startTime,
    endTime,
  } = useClipContext();


  const playbackRef = useRef({ progress: 0, offset: 0 });
  const [error, setError] = useState<string | null>(null);

  // Constants
  const corsProxyUrl = process.env.NEXT_PUBLIC_CORS_PROXY_URL || '';
  const proxyBaseUrl = `${corsProxyUrl}/raw?url=`;
  const proxiedSrc = `${proxyBaseUrl}${encodeURIComponent(src)}`;

  // Helper functions
  const handleFragmentChange = (event: any, data: any) => {
    if (!videoRef.current) return;

    const progress = videoRef.current.currentTime;
    const fragmentTime = data.frag.rawProgramDateTime;
    const offset =
      Date.now() -
      (fragmentTime ? new Date(fragmentTime).getTime() : Date.now());

    const newPlaybackStatus = { progress, offset };
    playbackRef.current = newPlaybackStatus;
    setPlaybackStatus(newPlaybackStatus);

    setTimeReference({
      unixTime: new Date(fragmentTime as string).getTime(),
      currentTime: progress,
    });
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
  }, [proxiedSrc, setPlaybackStatus, videoRef, setIsLoading, src]);

  return (
    <div className="relative flex h-2/3 flex-grow aspect-video w-full bg-black">
      <div className="absolute z-[9999] top-0 left-20 w-50 h-50 bg-white">
        <div className="flex flex-col items-center justify-center h-full">
          {startTime && <div>start: {startTime.displayTime}</div>}
          {endTime && <div>end: {endTime.displayTime}</div>}
        </div>
      </div>
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
