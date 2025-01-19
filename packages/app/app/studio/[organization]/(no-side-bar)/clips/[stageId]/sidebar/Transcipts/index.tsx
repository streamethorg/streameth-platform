'use client';
import TranscriptText from './TranscriptText';

const Transcripts = ({
  transcribe,
}: {
  transcribe: { word: string; start: number; end: number }[];
}) => {
  return (
    <div className="flex flex-col h-full overflow-y-scroll">
      <TranscriptText transcribe={transcribe} />
    </div>
  );
};

export default Transcripts;
