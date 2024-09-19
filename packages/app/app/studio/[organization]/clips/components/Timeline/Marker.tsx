import {
  ArrowLeftSquare,
  ArrowRightSquare,
  PlayIcon,
  PauseIcon,
} from 'lucide-react';
import { useClipContext } from '../ClipContext';
const formatTime = (seconds: number) => {
  if (!seconds) return '00:00:00';

  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

const Marker = ({
  handleMouseDown,
  marker,
  blocked,
}: {
  handleMouseDown: (marker: string, event: React.MouseEvent) => void;
  marker: string;
  blocked: boolean;
}) => {
  const { startTime, endTime, videoRef, selectedTooltip } = useClipContext();
  const getMarkerPosition = (time: number) => {
    if (videoRef.current && videoRef.current.duration) {
      return (time / videoRef.current.duration) * 100;
    }
    return 0;
  };
  return (
    <div
      className={`absolute h-[calc(100%-40px)] w-[15px] top-5`}
      style={{
        left: `${getMarkerPosition(
          marker === 'start' ? startTime.displayTime : endTime.displayTime
        )}%`,
      }}
      onMouseDown={(e) => {
        !blocked && handleMouseDown(marker, e);
      }}
    >
      <div className="relative h-full w-full">
        <div
          id={marker}
          className={` h-full cursor-pointer bg-primary bg-opacity-10 ${
            marker !== 'start'
              ? 'translate-x-[-100%] rounded-r-xl'
              : 'rounded-l-xl'
          } `}
        />
        {selectedTooltip === marker && (
          <div className="absolute left-[-55px] top-[-50px] flex flex-col items-center justify-center rounded-xl bg-primary p-1 text-xs text-white">
            <p className="flex w-[120px] flex-row items-center justify-center space-x-1">
              <span>Use</span> <ArrowLeftSquare width={15} height={15} />
              <ArrowRightSquare width={15} height={15} /> <span>to trim</span>
            </p>
            {formatTime(
              marker === 'start' ? startTime.displayTime : endTime.displayTime
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marker;

export const MarkerOverlay = () => {
  const { startTime, endTime, videoRef, selectedTooltip } = useClipContext();
  const getMarkerPosition = (time: number) => {
    if (videoRef.current && videoRef.current.duration) {
      return (time / videoRef.current.duration) * 100;
    }
    return 0;
  };
  return (
    <div
      className="absolute flex rounded-xl h-[calc(100%-40px)] top-5 "
      style={{
        background: 'rgba(76, 175, 80, 0.3)',
        left: `${getMarkerPosition(startTime.displayTime)}%`,
        right: `${100 - getMarkerPosition(endTime.displayTime)}%`,
      }}
    ></div>
  );
};
