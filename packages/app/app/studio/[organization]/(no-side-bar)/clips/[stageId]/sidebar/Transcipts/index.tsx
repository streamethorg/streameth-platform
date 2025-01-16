'use client';
import { useClipContext } from '../../ClipContext';
import TranscriptText from './TranscriptText';

const Transcripts = ({
  words,
  sessionId,
}: {
  words: { word: string; start: number; end: number }[];
  sessionId: string;
}) => {

  return (
    <div className="flex flex-col h-full overflow-y-scroll">
      <TranscriptText words={words} />
    </div>
  );
};

export default Transcripts;
