import React from "react";

const TimelineMarkers = ({
  maxLength,
  timelineWidth,
}: {
  maxLength: number;
  timelineWidth: number;
}): React.ReactNode => {
  const getMarkerPosition = (time: number) =>
    (time / maxLength) * timelineWidth;

  const renderSecondMarkers = () => {
    const markers = [];
    for (let i = 0; i <= maxLength; i += 30) {
      const position = getMarkerPosition(i);
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
