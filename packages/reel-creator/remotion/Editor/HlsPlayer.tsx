import Hls from "hls.js";
import React, { useEffect, useRef } from "react";
import { AbsoluteFill, RemotionVideoProps, Video } from "remotion";

export const HlsVideo: React.FC<RemotionVideoProps> = ({
  src,
  muted,
  style,
  className,
  startFrom,
  endAt,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) {
      throw new Error("src is required");
    }

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
  }, [src]);

  return (
    <Video
      ref={videoRef}
      src={src}
      muted={muted}
      style={style}
      className={className}
    />
  );
};
