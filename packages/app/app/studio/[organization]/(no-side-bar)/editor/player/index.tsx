'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Player } from '@remotion/player';
import Editor from 'streameth-reel-creator/remotion/Editor/Editor';
import { useEditorContext } from '../context/EditorContext';
import { useTimeline } from '../context/TimelineContext'; // Import the timeline context
import { z } from 'zod';
import PlayerControlBar from './PlayerControls';

const PlayerComponent: React.FC = () => {
  const {
    selectedAspectRatio,
    captionEnabled,
    captionLinesPerPage,
    captionPosition,
    captionFont,
    captionColor,
    fps,
    playerRef,
  } = useEditorContext();

  const { currentTime, events } = useTimeline();

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentTime * fps);
    }
  }, [currentTime, fps]);

  const getVideoDurationInFrames = () => {
    const maxEndTime = Math.max(...events.map((event) => event.end ?? 0));

    return Math.max(1, Math.round(maxEndTime * fps));
  };

  const getCompositionDimensions = () => {
    switch (selectedAspectRatio) {
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
    <div className="bg-gray-100 flex-col flex items-center w-full h-full justify-center text-white relative overflow-hidden">
      <Player
        ref={playerRef}
        component={Editor}
        inputProps={{
          frameRate: fps,
          events,
          selectedAspectRatio,
          captionEnabled,
          captionPosition,
          captionLinesPerPage,
          captionFont,
          captionColor,
        }}
        className="'w-full object-cover"
        durationInFrames={getVideoDurationInFrames()}
        fps={fps}
        compositionHeight={getCompositionDimensions().height}
        compositionWidth={getCompositionDimensions().width}
        spaceKeyToPlayOrPause
        controls={true}
      />
      <PlayerControlBar playerRef={playerRef} />
    </div>
  );
};

export default PlayerComponent;
