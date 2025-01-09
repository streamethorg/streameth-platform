"use client"
import { useClipContext } from '../../ClipContext';
import { Button } from '@/components/ui/button'; 
const Transcripts = ({
  words,
}: {
  words: { word: string; start: number }[];
}) => {
  const { currentTime, videoRef } = useClipContext();

  // Helper function to determine if a word should be highlighted
  const isWordActive = (
    word: { word: string; start: number },
    currentTime: number
  ) => {
    // You might want to adjust this logic based on your requirements
    return word.start <= currentTime && word.start + 1 > currentTime;
  };

  return (
    <div className="whitespace-pre-wrap">
      <Button>Extract Highlights</Button>
      {words?.map((word, index) => (
        <span
          key={`${word.word}-${index}`}
          className={`${
            isWordActive(word, currentTime) ? 'bg-yellow-200' : ''
          } inline-block mr-1 cursor-pointer hover:bg-gray-100`}
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = word.start;
            }
          }}
        >
          {word.word}
        </span>
      ))}
    </div>
  );
};

export default Transcripts;
