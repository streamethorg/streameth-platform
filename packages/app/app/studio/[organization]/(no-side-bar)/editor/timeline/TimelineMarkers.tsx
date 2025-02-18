import React from 'react';
import { useTimelineContext } from '../context/TimelineContext';
import useTimeline from '../../clips/[stageId]/Timeline/useTimeline';
const TimelineMarkers = (): React.ReactNode => {
  
  const { maxDuration, timelineWidth } = useTimelineContext();
  const { calculatePositionOnTimeline } = useTimeline();

  const renderSecondMarkers = () => {
    const markers = [];
    for (let i = 0; i <= maxDuration; i += 30) {
      const position = calculatePositionOnTimeline(
        i,
        maxDuration,
        timelineWidth
      );
      markers.push(
        <div
          key={i}
          className="absolute h-full"
          style={{ left: `${position}px` }}
        >
          <div className="absolute top-0 left-0 transform -translate-x-1/2 text-xs text-gray-400">
            {`${i}s`}
          </div>
          <div className="absolute top-4 h-2 border-l border-gray-600"></div>
        </div>
      );
    }
    return markers;
  };

  return (
    <div className="h-8 relative" style={{ width: `${timelineWidth}px` }}>
      {renderSecondMarkers()}
    </div>
  );
};

export default TimelineMarkers;
