'use client';
import SessionTranscriptions from '@/app/studio/[organization]/(root)/library/[session]/components/SessionTranscriptions';
import TranscriptText from './TranscriptText';
import { useClipPageContext } from '../../ClipPageContext';
import { ITranscript } from 'streameth-new-server/src/interfaces/transcribe.interface';
const Transcripts = ({
  transcripts,
}: {
  transcripts: ITranscript | null;
}) => {
  const { status: transcribeStatus, chunks } = transcripts ?? {
    status: null,
    chunks: [],
  };
  const { sessionId } = useClipPageContext();
  if (chunks?.length === 0 || !transcripts) {
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
      <TranscriptText chunks={chunks} />
    </div>
  );
};

export default Transcripts;
