import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useClipContext } from '../ClipContext';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';

import { InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMarkersContext } from '../sidebar/markers/markersContext';
import { LuArrowLeft, LuArrowRight, LuArrowBigUp } from 'react-icons/lu';
import { useTrimmControlsContext } from '../Timeline/TrimmControlsContext';
import { useTimelineContext } from '../Timeline/TimelineContext';
import usePlayer from '@/lib/hooks/usePlayer';

const KeyboardShortcuts = ({
  setPlaybackRate,
  playbackRates,
  currentPlaybackRateIndex,
  setCurrentPlaybackRateIndex,
}: {
  setPlaybackRate: Dispatch<SetStateAction<number>>;
  setCurrentPlaybackRateIndex: (index: number) => void;
  playbackRates: number[];
  playbackRate: number;
  currentPlaybackRateIndex: number;
}) => {
  const { videoRef, isCreatingClip } = useClipContext();
  const { isAddingOrEditingMarker } = useMarkersContext();
  const { setStartTime, setEndTime, startTime, endTime } =
    useTrimmControlsContext();
  const { videoDuration } = useTimelineContext();
  const isCreatingClipOrMarker = isCreatingClip || isAddingOrEditingMarker;

  const { currentTime, handleSetCurrentTime } = usePlayer(videoRef);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isCreatingClipOrMarker) return;
    if (!videoRef.current) return;

    switch (event.key) {
      // Playback controls
      case ' ':
      case 'k':
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.playbackRate = 1.0;
          setPlaybackRate(1);
          setCurrentPlaybackRateIndex(1);
          videoRef.current.pause();
        }
        break;

      // Trim controls
      case 'i':
        if (endTime > currentTime) {
          setStartTime(currentTime);
        }
        break;
      case 'o':
        if (startTime < currentTime) {
          setEndTime(currentTime);
        }
        break;

      // Seeking controls
      case 'ArrowLeft':
        event.preventDefault();
        const backwardSeek = event.shiftKey ? 10 : 1 / 20;
        const newBackwardTime = Math.max(currentTime - backwardSeek, 0);
        handleSetCurrentTime(newBackwardTime);
        videoRef.current.currentTime = newBackwardTime;
        break;
      case 'ArrowRight':
        event.preventDefault();
        const forwardSeek = event.shiftKey ? 10 : 1 / 20;
        const newForwardTime = Math.min(
          currentTime + forwardSeek,
          videoDuration
        );
        handleSetCurrentTime(newForwardTime);
        videoRef.current.currentTime = newForwardTime;
        break;

      // Playback rate controls
      case 'j':
        const fasterIndex = Math.min(
          currentPlaybackRateIndex + 1,
          playbackRates.length - 1
        );
        videoRef.current.playbackRate = playbackRates[fasterIndex];
        setCurrentPlaybackRateIndex(fasterIndex);
        setPlaybackRate(playbackRates[fasterIndex]);
        break;
      case 'l':
        const slowerIndex = Math.max(currentPlaybackRateIndex - 1, 0);
        videoRef.current.playbackRate = playbackRates[slowerIndex];
        setPlaybackRate(playbackRates[slowerIndex]);
        setCurrentPlaybackRateIndex(slowerIndex);
        break;
      case 'h':
        videoRef.current.playbackRate = playbackRates[1];
        setPlaybackRate(1);
        setCurrentPlaybackRateIndex(1);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentTime, startTime, endTime, videoRef]);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <InfoIcon size={22} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="z-[9999] w-[400px] overflow-auto">
        <div className="text-xs text-gray-700">
          <p className="font-semibold pb-2">Keyboard shortcuts</p>

          <div>
            <Badge variant="outline">
              <code>k</code>
            </Badge>{' '}
            Pause/Play in player.
          </div>
          <div>
            <Badge variant="outline">
              <code>+</code>
            </Badge>{' '}
            Zoom in.
          </div>
          <div>
            <Badge variant="outline">
              <code>-</code>
            </Badge>{' '}
            Zoom out.
          </div>
          <div>
            <Badge variant="outline">
              <code>0</code>
            </Badge>{' '}
            Zoom to fit.
          </div>
          <div>
            <Badge variant="outline">
              <code>i</code>
            </Badge>{' '}
            Slider start.
          </div>
          <div>
            <Badge variant="outline">
              <code>o</code>
            </Badge>{' '}
            Slider end.
          </div>
          <div>
            <Badge variant="outline">
              <code>j</code>
            </Badge>{' '}
            Speed up the video playback rate.
          </div>
          <div>
            <Badge variant="outline">
              <code>l</code>
            </Badge>{' '}
            Slow down the video playback rate.
          </div>
          <div>
            <Badge variant="outline">
              <LuArrowLeft size={12} />
            </Badge>{' '}
            Seek backward one second.
          </div>
          <div>
            <Badge variant="outline">
              <LuArrowRight size={12} />
            </Badge>{' '}
            Seek forward one second.
          </div>
          <div className="flex items-center">
            <Badge variant="outline">
              <code className="text-xs flex items-center">
                <LuArrowBigUp size={12} className="mr-1" /> +
                <LuArrowLeft size={12} className="ml-1" />
              </code>
            </Badge>
            Seek backward 10 seconds.
          </div>
          <div className="flex items-center">
            <Badge variant="outline">
              <code className="text-xs flex items-center">
                <LuArrowBigUp size={12} className="mr-1" /> +
                <LuArrowRight size={12} className="ml-1" />
              </code>
            </Badge>
            Seek forward 10 seconds.
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default KeyboardShortcuts;
