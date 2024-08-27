'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TextPlaceholder from '@/components/ui/text-placeholder';
import { generateTranscriptionActions } from '@/lib/actions/sessions';
import React, { useState } from 'react';
import { toast } from 'sonner';

const SessionTranscriptions = ({
  videoTranscription,
  organizationId,
  sessionId,
}: {
  videoTranscription?: string;
  sessionId: string;
  organizationId: string;
}) => {
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
      ) : (
        <Button
          variant={'primary'}
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
