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
    playbackStatus,
    setEndTime,
    endTime,
    startTime,
    fragmentLoading,
    setFragmentLoading,
  } = useClipContext();

  const playbackRef = useRef<{ progress: number; offset: number }>({
    progress: 0,
    offset: 0,
  });

  const [error, setError] = useState<string | null>(null);

  const corsProxyUrl = process.env.NEXT_PUBLIC_CORS_PROXY_URL || '';
  const proxyBaseUrl = `${corsProxyUrl}/raw?url=`;
  const proxiedSrc = `${proxyBaseUrl}${encodeURIComponent(src)}`;

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls({
        debug: false, // Enable debug logs
        xhrSetup: function (xhr, url) {
          //  if (url.endsWith(".ts")){
          //     url = url.replace(corsProxyUrl, "https://prod-ec-us-east-1.video.pscp.tv/Transcoding/v1/hls/aisgdiMou1VmMGXXA31KjMbfAgOwTNmOcnCTEm1h7TxuQGEmKencuaceIKTuC_8oBTmp3HXozs_9mxKF6QJ5cg/transcode/us-east-1/periscope-replay-direct-prod-us-east-1-public/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsInZlcnNpb24iOiIyIn0.eyJFbmNvZGVyU2V0dGluZyI6ImVuY29kZXJfc2V0dGluZ183MjBwMzBfMTAiLCJIZWlnaHQiOjcyMCwiS2JwcyI6Mjc1MCwiV2lkdGgiOjEyODB9.ldktM4fCFRfkP4ZEBfZPKtlAUNAcTPkoz994YJAzWpE")
          //     console.log(url)
          //   }
          if (type === 'youtube') {
            const proxiedUrl = `${proxyBaseUrl}${encodeURIComponent(url)}`;
            xhr.open('GET', proxiedUrl, true);
          }
        },
      });

      hls.loadSource(type === 'youtube' ? proxiedSrc : src);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.FRAG_CHANGED, (event, data) => {
        if (videoRef.current) {
          const progress = videoRef.current.currentTime;
          const offset =
            Date.now() -
            (data.frag.rawProgramDateTime
              ? new Date(data.frag.rawProgramDateTime).getTime()
              : Date.now());
          playbackRef.current = { progress, offset };
          setPlaybackStatus(playbackRef.current);
          setFragmentLoading(false);
        }
      });

      videoRef.current.onseeking = () => {
        setIsLoading(true);
        setFragmentLoading(true);
      };

      videoRef.current.onseeked = () => {
        setIsLoading(false);
      };

      hls.on(Hls.Events.ERROR, (event, data) => {
        setError(data.details);
      });

      const intervalId = setInterval(() => {
        if (videoRef.current) {
          const progress = videoRef.current.currentTime;
          playbackRef.current.progress = progress;
          setPlaybackStatus({ ...playbackRef.current });
        }
      }, 1000);
      return () => {
        hls.destroy();
        clearInterval(intervalId);
      };
    }
  }, [proxiedSrc, setPlaybackStatus, videoRef, setIsLoading, src]);

  useEffect(() => {
    if (
      videoRef.current &&
      videoRef.current.duration &&
      playbackStatus &&
      endTime.unix === 0
    ) {
      setEndTime({
        displayTime: 30, // Set end time to 30 seconds
        unix: Date.now() - playbackStatus.offset + 30000, // Adjust unix time to 30 seconds from now
      });
    }
  }, [setEndTime, videoRef, playbackStatus]);

  return (
    <div className="relative flex h-2/3 flex-grow aspect-video w-full bg-black">
      <video
        ref={videoRef}
        autoPlay={false}
        controls={false}
        className="sticky top-0 w-full rounded-lg"
      ></video>
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        {isLoading && (
          <div className="h-20 w-20 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
        )}
      </div>
    </div>
  );
};

export default ReactHlsPlayer;
