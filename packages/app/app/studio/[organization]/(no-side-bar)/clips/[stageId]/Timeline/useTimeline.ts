const useTimeline = (
  timelineRef: React.RefObject<HTMLDivElement>,
) => {
  const getRelativePosition = (position: number) => {
    const timelineRect = timelineRef.current?.getBoundingClientRect();
    if (!timelineRect) return 0;
    return position - timelineRect.left;
  };

  const calculatePositionOnTimeline = (time: number, maxTime: number, timelineWidth: number) => {
    if (!timelineWidth) return 0;
    return (time / maxTime) * timelineWidth;
  };

  const calculateTimeFromPosition = (position: number, maxTime: number, timelineWidth: number) => {
    if (!timelineWidth) return 0;
    // const relativePosition = getRelativePosition(position);
    return (position / timelineWidth) * maxTime;
  };

  const calculateTimeFromPositionDelta = (
    toPosition: number,
    maxTime: number,
    initialEventStart: number,
    timelineWidth: number
  ) => {
    const fromPosition = calculatePositionOnTimeline(
      initialEventStart,
      maxTime,
      timelineWidth
    );
    const mouseDelta = toPosition - fromPosition;
    const timeDelta = calculateTimeFromPosition(mouseDelta, maxTime, timelineWidth);
    return Math.max(0, Math.min(maxTime, initialEventStart + timeDelta));
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
    calculateTimeFromPositionDelta,
  };
};

export default useTimeline;
