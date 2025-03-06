import Hls from "hls.js";
import React, { useEffect, useRef } from "react";
import { AbsoluteFill, RemotionVideoProps, Video } from "remotion";

interface HlsVideoProps extends RemotionVideoProps {
  startFrom?: number;
  endAt?: number;
}

export const HlsVideo: React.FC<
  RemotionVideoProps & { startFrom?: number; endAt?: number }
> = ({ src, muted, style, className, startFrom, endAt }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) {
      throw new Error("src is required");
    }
    console.log("startFrom", startFrom, src);
    const hls = new Hls({
      startLevel: 4,
      maxBufferLength: 5,
      maxMaxBufferLength: 5,
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      hls.startLoad(startFrom);
    });

    hls.loadSource(src);
    hls.attachMedia(videoRef.current!);

    return () => {
      hls.destroy();
    };
  }, [src, startFrom]);

  return (
    <Video
      startFrom={startFrom}
      ref={videoRef}
      src={src}
      muted={muted}
      style={style}
      className={className }
      onError={(e) => {
        console.log("error", e.message);
      }}
    />
  );
};
