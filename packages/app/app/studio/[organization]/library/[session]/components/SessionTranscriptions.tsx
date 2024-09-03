'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TextPlaceholder from '@/components/ui/text-placeholder';
import { generateTranscriptionActions } from '@/lib/actions/sessions';
import { IExtendedState } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { LuLoader2, LuRefreshCcw } from 'react-icons/lu';
import { toast } from 'sonner';

const SessionTranscriptions = ({
  videoTranscription,
  organizationId,
  sessionId,
  transcriptionState,
}: {
  videoTranscription?: string;
  sessionId: string;
  organizationId: string;
  transcriptionState: IExtendedState[];
}) => {
  const router = useRouter();
  const [isGeneratingTranscript, setIsGeneratingTranscript] = useState(false);
  const handleGenerateTranscription = async () => {
    setIsGeneratingTranscript(true);
    await generateTranscriptionActions({
      organizationId,
      sessionId,
    })
      .then((response) => {
        if (response) {
          toast.success('Transcription request sent successfully');
        } else {
          toast.error('Error generating transcript');
        }
      })
      .catch(() => {
        toast.error('Error generating transcript');
      })
      .finally(() => {
        setIsGeneratingTranscript(false);
      });
  };
  return (
    <div>
      <Label>Transcript</Label>
      {videoTranscription ? (
        <div>
          <TextPlaceholder text={videoTranscription} />
        </div>
      ) : transcriptionState[0]?.status === 'pending' ? (
        <div className="flex items-center">
          <LuLoader2 className="mr-2 w-4 h-4 animate-spin" /> Processing
          transcription...{' '}
          <p className="pl-2" title="refresh" onClick={() => router.refresh()}>
            <LuRefreshCcw />
          </p>
        </div>
      ) : transcriptionState[0]?.status === 'failed' ? (
        <div>
          <p>Transcription failed. Please try again.</p>
          <Button
            variant="primary"
            className="mt-2"
            onClick={handleGenerateTranscription}
            loading={isGeneratingTranscript}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          className="mt-2"
          onClick={handleGenerateTranscription}
          loading={isGeneratingTranscript}
        >
          Generate Transcriptions
        </Button>
      )}
    </div>
  );
};

export default SessionTranscriptions;
