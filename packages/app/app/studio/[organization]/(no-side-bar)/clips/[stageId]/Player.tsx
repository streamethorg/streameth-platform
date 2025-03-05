'use client';
import React from 'react';
import { Player } from '@remotion/player';
import Editor from 'streameth-reel-creator/remotion/Editor/Editor';
import { useEventContext } from './Timeline/EventConntext';
import { useClipPageContext } from './ClipPageContext';

const PlayerComponent: React.FC = () => {
  const { aspectRatio, captionsOptions, videoRef, metadata } =
    useClipPageContext();
  const { fps } = metadata;
  const { enabled, linesPerPage, position, font, color } =
    captionsOptions || {};
  const { getEventsDuration } = useEventContext();

  const getCompositionDimensions = () => {
    switch (aspectRatio) {
      case '16:9':
        return { width: 1920, height: 1080 };
      case '9:16':
        return { width: 1080, height: 1920 };
      case '1:1':
        return { width: 1920, height: 1080 };
      default:
        return { width: 1920, height: 1080 };
    }
  };

  return (
    <div className="bg-black flex-col flex items-center w-full h-full justify-center text-white relative">
      <Player
        ref={videoRef}
        component={Editor}
        inputProps={{
          frameRate: fps,
          events:[{
            id: 'start',
            label: 'Start',
            type: 'media',
            url: metadata.videoUrl,
            start: 0,
            end: metadata.duration,
            duration: metadata.duration,
          }],
          aspectRatio,
          enabled,
          linesPerPage,
          position,
          font,
          color,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        durationInFrames={metadata.duration * fps}
        fps={fps}
        compositionHeight={getCompositionDimensions().height}
        compositionWidth={getCompositionDimensions().width}
        spaceKeyToPlayOrPause
        controls={true}
      />
    </div>
  );
};

export default PlayerComponent;
