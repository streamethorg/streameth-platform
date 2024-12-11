import React, { useState, useEffect, useCallback } from 'react';
import { PlayerRef } from '@remotion/player';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat,
  Square, Maximize2, Minimize2, Volume2, VolumeX
} from 'lucide-react';
import { useTimeline } from '@/context/TimelineContext';
import { useEditorContext } from '@/context/EditorContext';
import { useCurrentPlayerFrame } from '@/app/hooks/useCurrentPlayerFrame';

interface PlayerControlBarProps {
  playerRef: React.RefObject<PlayerRef>;
}

const PlayerControlBar: React.FC<PlayerControlBarProps> = ({ playerRef }) => {
  const {fps} = useEditorContext()
  const { setCurrentTime} = useTimeline()
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentFrame = useCurrentPlayerFrame(playerRef)
  useEffect(() => {
    // setCurrentTime(currentFrame/fps)
  }, [currentFrame])
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const handlePlaybackChange = () => {
        setIsPlaying(player.isPlaying());
      };
      player.addEventListener('play', handlePlaybackChange);
      player.addEventListener('pause', handlePlaybackChange);
      return () => {
        player.removeEventListener('play', handlePlaybackChange);
        player.removeEventListener('pause', handlePlaybackChange);
      };
    }
  }, [playerRef]);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    }
  }, [isPlaying, playerRef]);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.mute();
      setIsMuted(!isMuted);
    }
  }, [isMuted, playerRef]);

  const toggleFullscreen = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      if (!isFullscreen) {
        player.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  }, [isFullscreen, playerRef]);

  return (
    <div className="flex items-center justify-between bg-gray-800 text-white p-2 w-full">
      <div className="flex items-center space-x-2">
        <button onClick={() => playerRef.current?.seekTo(0)}><SkipBack size={16} /></button>
        <button onClick={togglePlay}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={() => playerRef.current?.seekTo(Infinity)}><SkipForward size={16} /></button>
        <button onClick={() => playerRef.current?.seekTo(0)}><Square size={16} /></button>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => {}}><Repeat size={16} /></button>
        <button onClick={toggleMute}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
};

export default PlayerControlBar;
