'use client';
import SessionTranscriptions from '@/app/studio/[organization]/(root)/library/[session]/components/SessionTranscriptions';
import TranscriptText from './TranscriptText';
import { useMarkersContext } from '../markers/markersContext';
import { TranscriptionStatus } from 'streameth-new-server/src/interfaces/state.interface';
const Transcripts = ({
  transcribe,
  sessionId,
  transcribeStatus,
}: {
  transcribe: { word: string; start: number; end: number }[];
  sessionId?: string;
  transcribeStatus: TranscriptionStatus | null;
}) => {
  const { organizationId } = useMarkersContext();

  console.log('transcribe', transcribe, transcribeStatus);
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
            organizationId={organizationId}
            sessionId={sessionId || ''}
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
