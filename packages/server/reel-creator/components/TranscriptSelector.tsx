import React, { useState, useRef, useEffect } from 'react';

interface Word {
  word: string;
  start: number;
  end: number;
}

interface TranscriptSelectorProps {
  transcript: {
    text: string;
    words: Word[];
  };
  setStartTime: (time: number) => void;
  setEndTime: (time: number) => void;
}

const TranscriptSelector: React.FC<TranscriptSelectorProps> = ({ transcript, setStartTime, setEndTime }) => {
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectionStart !== null && selectionEnd !== null) {
      const startWord = transcript.words.find(word => word.start >= selectionStart);
      const endWord = transcript.words.reverse().find(word => word.end <= selectionEnd);
      
      if (startWord && endWord) {
        setStartTime(startWord.start);
        setEndTime(endWord.end);
      }
    }
  }, [selectionStart, selectionEnd, transcript.words, setStartTime, setEndTime]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setSelectionStart((e.clientX - rect.left) / rect.width * transcript.text.length);
      setSelectionEnd(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectionStart !== null && textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setSelectionEnd((e.clientX - rect.left) / rect.width * transcript.text.length);
    }
  };

  const handleMouseUp = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      if (selectionStart > selectionEnd) {
        setSelectionStart(selectionEnd);
        setSelectionEnd(selectionStart);
      }
    }
  };

  return (
    <div
      ref={textRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: 'relative', userSelect: 'none' }}
    >
      <div className='text-white'>{transcript.text}</div>
      {selectionStart !== null && selectionEnd !== null && (
        <div
          style={{
            color: "white",
            position: 'absolute',
            top: 0,
            left: `${(Math.min(selectionStart, selectionEnd) / transcript.text.length) * 100}%`,
            width: `${(Math.abs(selectionEnd - selectionStart) / transcript.text.length) * 100}%`,
            height: '100%',
            backgroundColor: 'rgba(0, 123, 255, 0.3)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default TranscriptSelector;