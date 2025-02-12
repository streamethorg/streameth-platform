'use client';
import SessionTranscriptions from '@/app/studio/[organization]/(root)/library/[session]/components/SessionTranscriptions';
import TranscriptText from './TranscriptText';
import { TranscriptionStatus } from 'streameth-new-server/src/interfaces/state.interface';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { useClipPageContext } from '../../ClipPageContext';
const Transcripts = ({
  transcribe,
  transcribeStatus,
}: {
  transcribe: { word: string; start: number; end: number }[];
  transcribeStatus: TranscriptionStatus | null;
}) => {
  const { sessionId } = useClipPageContext();
  if (transcribe?.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex flex-col space-y-4 text-center items-center justify-center h-full">
          <p className="text-lg font-semibold">No transcript available</p>
          <p className="text-md text-muted-foreground">
            Seems like this stage is not transcribed yet, click below to
            transcribe it
          </p>
          <SessionTranscriptions
            sessionId={sessionId}
            transcriptionState={transcribeStatus ?? null}
          />
          {transcribeStatus === 'processing' && (
            <p className="text-sm text-muted-foreground">
              (estimated time: 10 minutes)
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TranscriptText transcribe={transcribe} />
    </div>
  );
};

export default Transcripts;
