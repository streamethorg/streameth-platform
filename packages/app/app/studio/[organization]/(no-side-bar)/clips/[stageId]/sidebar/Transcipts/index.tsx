'use client';
import { useClipContext } from '../../ClipContext';
import { Button } from '@/components/ui/button';
import { extractHighlightsAction } from '@/lib/actions/sessions';
import { useState } from 'react';
import TranscriptText from './TranscriptText';
import HighlightCard from './HighlightCard';
import { Input } from '@/components/ui/input';
import { IHighlight } from '@/lib/types';



const Transcripts = ({
  words,
  sessionId,
  organizationId,
  stageId,
}: {
  words: { word: string; start: number; end: number }[];
  sessionId: string;
  organizationId: string;
  stageId: string;
}) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [highlights, setHighlights] = useState<IHighlight[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`highlights-${sessionId}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const handleExtractHighlights = async () => {
    setIsExtracting(true);
    const highlights = await extractHighlightsAction({
      sessionId: sessionId,
      prompt: prompt,
    });
    setHighlights(highlights);
    localStorage.setItem(`highlights-${sessionId}`, JSON.stringify(highlights));
    setIsExtracting(false);
  };

  const handleDeleteHighlight = (index: number) => {
    const newHighlights = [...highlights];
    newHighlights.splice(index, 1);
    setHighlights(newHighlights);
    localStorage.setItem(
      `highlights-${sessionId}`,
      JSON.stringify(newHighlights)
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-scroll">
      <div className="flex flex-col gap-2 max-h-[60%] h-full overflow-y-scroll">
        <Input
          placeholder="Prompt for highlights"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        {isExtracting ? (
          <Button disabled>Extracting...</Button>
        ) : (
          <Button
            onClick={() => {
              handleExtractHighlights();
            }}
          >
            Extract Highlights
          </Button>
        )}
        {highlights.length > 0 && (
          <div className="flex flex-col gap-2">
            {highlights.map((highlight, index) => (
              <HighlightCard
                organizationId={organizationId}
                stageId={stageId}
                highlight={highlight}
                key={index}
                onDelete={() => handleDeleteHighlight(index)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col h-1/2 overflow-y-scroll">
        <TranscriptText words={words} />
      </div>
    </div>
  );
};

export default Transcripts;
