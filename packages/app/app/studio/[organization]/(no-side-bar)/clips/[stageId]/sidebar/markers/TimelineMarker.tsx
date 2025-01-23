import { useTimelineContext } from '../../Timeline/TimelineContext';
import { IExtendedMarker } from '@/lib/types';
import { useMarkersContext } from './markersContext';
import { useTrimmControlsContext } from '../../Timeline/TrimmControlsContext';
import useTimeline from '../../Timeline/useTimeline';
import usePlayer from '@/lib/hooks/usePlayer';

const TimelineMarker = ({ marker }: { marker: IExtendedMarker }) => {
  const { videoDuration, timelineWidth, isPreviewMode, videoRef } = useTimelineContext();
  const { currentTime, handleSetCurrentTime } = usePlayer(videoRef);
  const { setStartTime, setEndTime } = useTrimmControlsContext();
  const { selectedMarkerId, setSelectedMarkerId } = useMarkersContext();
  const { calculatePositionOnTimeline } = useTimeline();

  if (marker.startClipTime > videoDuration || marker.endClipTime > videoDuration)
    return null;

  const handleMarkerClick = (marker: IExtendedMarker) => {
    if (isPreviewMode) {
      return;
    }
    setStartTime(marker.startClipTime);
    setEndTime(marker.endClipTime);
    setSelectedMarkerId(marker._id);
    handleSetCurrentTime(marker.startClipTime);
  };

  const position = calculatePositionOnTimeline(marker.startClipTime, videoDuration, timelineWidth);

  return (
    <div
      key={marker._id}
      className={`absolute h-[20px] border bg-opacity-20 rounded z-[21]`}
      onClick={() => handleMarkerClick(marker)}
      style={{
        backgroundColor: isPreviewMode ? 'gray' : marker.color,
        border: `2px solid ${
          isPreviewMode
            ? 'gray'
            : selectedMarkerId === marker._id
            ? '#066FF9'
            : marker.color
        }`,
        left: `${position}px`,
        width: `${
          ((marker.endClipTime - marker.startClipTime) / videoDuration) *
          timelineWidth
        }px`,
      }}
    >
      <p className="text-[10px] text-white truncate">
        {marker.name.length > 20
          ? `${marker.name.substring(0, 20)}...`
          : marker.name}
      </p>
    </div>
  );
};

export default TimelineMarker;
