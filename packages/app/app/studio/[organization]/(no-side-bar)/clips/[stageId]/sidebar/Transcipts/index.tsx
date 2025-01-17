'use client';
import TranscriptText from './TranscriptText';

const Transcripts = ({
  words,
}: {
  words: { word: string; start: number; end: number }[];
}) => {
  return (
    <div className="flex flex-col h-full overflow-y-scroll">
      <TranscriptText words={words} />
    </div>
  );
};

export default Transcripts;
