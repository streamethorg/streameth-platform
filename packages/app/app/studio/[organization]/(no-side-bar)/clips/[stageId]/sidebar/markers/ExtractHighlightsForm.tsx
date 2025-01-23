'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { extractHighlightsAction } from '@/lib/actions/sessions';
import { TranscriptionStatus } from 'streameth-new-server/src/interfaces/state.interface';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import Logo from '@/public/logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchSession } from '@/lib/services/sessionService';
import { fetchMarkers } from '@/lib/services/markerSevice';
import { useMarkersContext } from './markersContext';
import { useClipContext } from '../../ClipContext';
const PRESET_PROMPTS = [
  'Extract all talk and panels from this video',
  'Extract key moments for short form content',
] as const;

export const ExtractHighlightsForm = ({
  sessionId,
  transcribeStatus,
  aiAnalysisStatus,
}: {
  sessionId: string;
  transcribeStatus: TranscriptionStatus | null;
  aiAnalysisStatus: ProcessingStatus | null;
}) => {
  const { setIsInputFocused } = useClipContext();
  const { fetchAndSetMarkers } = useMarkersContext();
  const [prompt, setPrompt] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const router = useRouter();

  const handleExtractHighlights = async () => {
    if (transcribeStatus !== 'completed') {
      toast.error('Please transcribe the video first');
      return;
    }
    setIsExtracting(true);
    try {
      await extractHighlightsAction({ sessionId, prompt });
      setStatus(ProcessingStatus.pending);
      toast.success('Highlights extracted');
      router.refresh();
    } catch (err) {
      toast.error('Failed to extract highlights');
    } finally {
      setIsExtracting(false);
    }
  };

  const fetchStatus = async () => {
    console.log('fetching status');
    const session = await fetchSession({ session: sessionId });
    if (session) {
      setStatus(session.aiAnalysis?.status ?? null);
      console.log('session.aiAnalysis?.status', session.aiAnalysis?.status);
      if (session.aiAnalysis?.status === 'completed') {
        fetchAndSetMarkers();
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      const isCompleted = await fetchStatus();
      if (!isCompleted) {
        timeoutId = setTimeout(poll, 10000);
      }
    };

    fetchStatus();

    if (status === 'pending') {
      poll();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status, sessionId, fetchAndSetMarkers]);

  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center h-full my-4">
        <Image src={Logo} alt="Logo" className="w-10 h-10 animate-bounce" />
        <p>Using AI to extract highlights...</p>
        <p className="text-sm text-muted-foreground">
          This may take a few minutes
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {PRESET_PROMPTS.map((presetPrompt) => (
          <Badge
            key={presetPrompt}
            variant="default"
            className="text-sm hover:cursor-pointer hover:bg-gray-100 w-auto"
            onClick={() => setPrompt(presetPrompt)}
          >
            &quot;{presetPrompt}&quot;
          </Badge>
        ))}
      </div>
      <Textarea
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        placeholder="Prompt for highlights"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button
        className="w-full"
        variant="primary"
        disabled={isExtracting || prompt.length === 0}
        onClick={handleExtractHighlights}
      >
        {isExtracting ? 'Extracting...' : 'Extract Highlights'}
      </Button>
    </div>
  );
};
