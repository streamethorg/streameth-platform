'use client';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { Card, CardContent } from '@/components/ui/card';
import { fetchSessionRenderingProgress } from '@/lib/services/sessionService';
import { IExtendedSession } from '@/lib/types';
import { formatDate } from '@/lib/utils/time';
import { useEffect, useState } from 'react';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import Preview from './Preview';

// Processing Card Component
function ProcessingCard({
  session,
  status,
  progress,
}: {
  session: IExtendedSession;
  status: ProcessingStatus;
  progress: { type: 'progress' | 'done'; progress: number } | null;
}) {
  return (
    <Card className="w-full cursor-not-allowed animate-pulse max-w-2xl overflow-hidden px-2 py-1 shadow-none bg-muted">
      <div className="flex justify-center items-center">
        <div className="flex-shrink-0 w-1/3">
          <Thumbnail imageUrl={session.coverImage} />
        </div>
        <CardContent className="lg:p-2 p-2 flex-grow">
          <h2 className="text-lg font-semibold line-clamp-1">{session.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {status === ProcessingStatus.rendering
              ? 'Video is rendering...'
              : 'Video is processing...'}
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-500 mt-1">
              {Math.round(Number(progress?.progress ?? 0) * 100)}% complete.
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              {formatDate(
                new Date(session.createdAt as string),
                'ddd. MMM. D, YYYY'
              )}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default function Clip({ session }: { session: IExtendedSession }) {
  const [progress, setProgress] = useState<{
    type: 'progress' | 'done';
    progress: number;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus>(
    session.processingStatus ?? ProcessingStatus.pending
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const getAsset = async () => {
      try {
        const progress = await fetchSessionRenderingProgress({
          sessionId: session._id,
        });
        setProgress(progress);
        if (progress.type === 'done') {
          setStatus(ProcessingStatus.completed);
        }
      } catch (error) {
        console.error('Failed to fetch rendering progress:', error);
      }
    };
    setStatus(session.processingStatus ?? ProcessingStatus.pending);

    if (
      session.processingStatus === ProcessingStatus.pending ||
      session.processingStatus === ProcessingStatus.rendering
    ) {
      getAsset(); // Initial fetch
      intervalId = setInterval(getAsset, 20000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [session._id, session.processingStatus]);

  const renderContent = () => {
    if (
      status === ProcessingStatus.pending ||
      status === ProcessingStatus.rendering
    ) {
      return (
        <ProcessingCard session={session} status={status} progress={progress} />
      );
    }

    if (status === ProcessingStatus.failed) {
      return (
        <Card className="w-full cursor-not-allowed border border-destructive max-w-2xl overflow-hidden px-2 py-1 shadow-none bg-muted">
          <div className="flex justify-center items-center">
            <div className="flex-shrink-0 w-1/3">
              <Thumbnail imageUrl={session.coverImage} />
            </div>
            <CardContent className="lg:p-2 p-2 flex-grow">
              <h2 className="text-lg font-semibold line-clamp-1">
                {session.name}
              </h2>
              <p className="text-sm text-destructive mt-1">
                Video processing failed
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                {formatDate(
                  new Date(session.createdAt as string),
                  'ddd. MMM. D, YYYY'
                )}
              </p>
            </CardContent>
          </div>
        </Card>
      );
    }

    return (
      <Card
        onClick={() => setIsOpen(true)}
        className="w-full max-w-2xl overflow-hidden p-2 shadow-none cursor-pointer hover:bg-gray-100"
      >
        <div className="flex justify-center items-center">
          <div className="flex-shrink-0 w-1/3">
            <Thumbnail imageUrl={session.coverImage} />
          </div>
          <CardContent className="lg:p-2 p-2 flex-grow">
            <h2 className="text-lg font-semibold line-clamp-1">
              {session.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(
                new Date(session.createdAt as string),
                'ddd. MMM. D, YYYY'
              )}
            </p>
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <>
      <div>{renderContent()}</div>
      {isOpen && (
        <Preview
          isOpen={isOpen}
          session={session}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}
