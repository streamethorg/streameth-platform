'use client';
import { Button } from '@/components/ui/button';
import TextPlaceholder from '@/components/ui/text-placeholder';
import { generateTranscriptionActions } from '@/lib/actions/sessions';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { LuLoader2, LuRefreshCcw } from 'react-icons/lu';
import { toast } from 'sonner';
import { TranscriptionStatus } from 'streameth-new-server/src/interfaces/state.interface';
import { Label } from '@/components/ui/label';
const SessionTranscriptions = ({
  videoTranscription,
  sessionId,
  transcriptionState,
}: {
  videoTranscription?: string;
  sessionId: string;
  transcriptionState: TranscriptionStatus | null;
}) => {
  const { organizationId } = useOrganizationContext();
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

  if (transcriptionState === TranscriptionStatus.processing) {
    return (
      <div className="flex items-center border rounded-xl p-2">
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
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row items-center gap-2">
          <Label>Transcriptions</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateTranscription}
            loading={isGeneratingTranscript}
            className="flex items-center gap-2"
          >
            <LuRefreshCcw className="w-4 h-4 cursor-pointer" />
            Regenerate
          </Button>
        </div>
        <TextPlaceholder text={videoTranscription} />
      </div>
    );
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
