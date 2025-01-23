import usePlayer from '@/lib/hooks/usePlayer';
import { useClipContext } from '../../ClipContext';
import { useEffect, useRef } from 'react';

// Helper function to determine if a word should be highlighted
const isWordActive = (
  word: { word: string; start: number; end: number },
  currentTime: number
) => {
  // You might want to adjust this logic based on your requirements
  return word.start <= currentTime && word.end >= currentTime;
};

const TranscriptText = ({
  transcribe,
}: {
  transcribe: { word: string; start: number; end: number }[];
}) => {
  const { videoRef } = useClipContext();
  const { currentTime, handleSetCurrentTime } = usePlayer(videoRef);
  const containerRef = useRef<HTMLDivElement>(null);
  const TIME_WINDOW = 30 * 60; // 30 minutes in seconds

  const visibleWords = transcribe.filter(
    (word) =>
      word.start >= currentTime - TIME_WINDOW &&
      word.end <= currentTime + TIME_WINDOW
  );

  useEffect(() => {
    const handleTimeUpdate = () => {
      const activeWord = visibleWords.find((word) =>
        isWordActive(word, currentTime)
      );

      if (activeWord && containerRef.current) {
        const activeElement = document.getElementById(
          `word-${activeWord.start}`
        );
        if (activeElement) {
          // Replace scrollIntoView with manual scroll calculation
          const containerRect = containerRef.current.getBoundingClientRect();
          const elementRect = activeElement.getBoundingClientRect();

          containerRef.current.scrollTop +=
            elementRect.top -
            containerRect.top -
            containerRect.height / 2 +
            elementRect.height / 2;
        }
      }
    };

    videoRef.current?.addEventListener('timeupdate', handleTimeUpdate);
  }, [currentTime]); // Remove currentTime from dependencies since we get it from videoRef

  return (
    <div
      ref={containerRef}
      className="whitespace-pre-wrap p-4 leading-loose h-full overflow-y-scroll"
    >
      {transcribe.map((word, index) => (
        <span
          key={`${word.word}-${index}`}
          id={`word-${word.start}`}
          className={`px-[2.1px] rounded-xl ${
            isWordActive(word, currentTime) ? 'bg-yellow-200' : ''
          } inline-block mr-1 cursor-pointer hover:bg-gray-100`}
          onClick={() => {
            handleSetCurrentTime(word.end);
          }}
        >
          {word.word}
        </span>
      ))}
    </div>
  );
};

export default TranscriptText;
