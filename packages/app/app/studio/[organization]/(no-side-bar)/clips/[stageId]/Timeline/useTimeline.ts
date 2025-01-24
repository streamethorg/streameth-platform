import { useTimelineContext } from './TimelineContext';

const useTimeline = () => {
  const calculatePositionOnTimeline = (
    time: number,
    maxLength: number,
    timelineWidth: number
  ) => {
    return (time / maxLength) * timelineWidth;
  };

  const calculateTimeFromPosition = (
    fromPosition: number,
    toPosition: number,
    maxLength: number,
    timelineWidth: number,
    initialEventStart: number
  ) => {
    const mouseDelta = toPosition - fromPosition;
    const timeDelta = (mouseDelta / timelineWidth) * maxLength;
    return Math.max(0, Math.min(maxLength, initialEventStart + timeDelta));
  };
  const calculateTimelineScale = ({
    timelineContainerWidth,
    maxLength,
  }: {
    timelineContainerWidth: number;
    maxLength: number;
  }) => {
    const screenWidth = window.innerWidth;
    const minScale = 0.1; // Further reduced minimum pixels per second
    const maxScale = 14; // Maximum pixels per second
    const targetWidth = timelineContainerWidth || screenWidth;
    // Calculate initial scale
    let scale = targetWidth / maxLength;

    // Adjust scale for longer videos
    if (maxLength > 10800) {
      // More than 3 hours
      scale = Math.min(scale, 0.15); // Limit scale to 0.2 pixels per second for extremely long videos
    } else if (maxLength > 7200) {
      // 2 to 3 hours
      scale = Math.min(scale, 0.5); // Limit scale to 0.5 pixels per second
    } else if (maxLength > 3600) {
      // 1 to 2 hours
      scale = Math.min(scale, 1); // Limit scale to 1 pixel per second
    } else if (maxLength > 1800) {
      // 30 minutes to 1 hour
      scale = Math.min(scale, 2); // Limit scale to 2 pixels per second
    }
    scale = Math.max(minScale, Math.min(maxScale, scale));
    return scale;
  };

  return {
    calculateTimelineScale,
    calculatePositionOnTimeline,
    calculateTimeFromPosition,
  };
};

export default useTimeline;
