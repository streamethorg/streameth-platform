import { useState, useEffect } from 'react';

const usePlayer = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [currentTime, setCurrentTime] = useState(0);

  const handleSetCurrentTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [videoRef]);

  return { currentTime, handleSetCurrentTime };
};

export default usePlayer;
