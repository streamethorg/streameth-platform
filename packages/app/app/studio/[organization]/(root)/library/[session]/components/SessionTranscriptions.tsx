'use client';
import { Button } from '@/components/ui/button';
import TextPlaceholder from '@/components/ui/text-placeholder';
import { generateTranscriptionActions } from '@/lib/actions/sessions';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { LuLoader2, LuRefreshCcw } from 'react-icons/lu';
import { toast } from 'sonner';
import { TranscriptionStatus } from 'streameth-new-server/src/interfaces/state.interface';

const SessionTranscriptions = ({
  videoTranscription,
  organizationId,
  sessionId,
  transcriptionState,
}: {
  videoTranscription?: string;
  sessionId: string;
  organizationId: string;
  transcriptionState: TranscriptionStatus | null;
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
        console.log('response', response);
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

  if (transcriptionState === TranscriptionStatus.processing) {
    return (
      <div className="flex items-center">
        <LuLoader2 className="mr-2 w-4 h-4 animate-spin" /> Processing
        transcription...{' '}
        <p
          className="pl-2 cursor-pointer"
          title="refresh"
          onClick={() => router.refresh()}
        >
          <LuRefreshCcw />
        </p>
      </div>
    );
  }

  if (
    transcriptionState === TranscriptionStatus.completed &&
    videoTranscription
  ) {
    return <TextPlaceholder text={videoTranscription} />;
  }

  if (transcriptionState === TranscriptionStatus.failed) {
    return (
      <div>
        <p>Transcription failed. Please try again.</p>
        <Button
          variant="primary"
          className="w-full"
          onClick={handleGenerateTranscription}
          loading={isGeneratingTranscript}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      className="w-full"
      onClick={handleGenerateTranscription}
      loading={isGeneratingTranscript}
    >
      Generate Transcriptions
    </Button>
  );
};

export default SessionTranscriptions;
