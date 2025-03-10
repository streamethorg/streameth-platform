import { useTimelineContext } from '../../Timeline/TimelineContext';
import { IExtendedMarker } from '@/lib/types';
import { useMarkersContext } from './markersContext';
import useTimeline from '../../Timeline/useTimeline';
import { useClipPageContext } from '../../ClipPageContext';
import { useRemotionPlayer } from '@/lib/hooks/useRemotionPlayer';

const TimelineMarker = ({ marker }: { marker: IExtendedMarker }) => {
  const { metadata, videoRef } = useClipPageContext();
  const { isPreviewMode, timelineWidth, timelineRef } = useTimelineContext();
  const { handleSetCurrentTime } = useRemotionPlayer(videoRef, metadata.fps);
  const { selectedMarkerId, setSelectedMarkerId } = useMarkersContext();
  const { calculatePositionOnTimeline } = useTimeline(timelineRef);

  if (
    marker.startClipTime > metadata.duration ||
    marker.endClipTime > metadata.duration
  )
    return null;

  const handleMarkerClick = (marker: IExtendedMarker) => {
    if (isPreviewMode) {
      return;
    }
    // setStartTime(marker.startClipTime);
    // setEndTime(marker.endClipTime);
    setSelectedMarkerId(marker._id);
    handleSetCurrentTime(marker.startClipTime);
  };

  const position = calculatePositionOnTimeline(
    marker.startClipTime,
    metadata.duration
  );

  return (
    <div
      key={marker._id}
      className={`absolute top-8 h-[20px] border bg-opacity-20 rounded z-[21]`}
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
          ((marker.endClipTime - marker.startClipTime) / metadata.duration) *
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
