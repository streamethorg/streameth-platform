'use client';
import VideoCard from '@/components/misc/VideoCard';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { IExtendedEvent, IExtendedSession } from '@/lib/types';

const ClipsSessionList = ({
  sessions,
  event,
}: {
  event?: IExtendedEvent;
  sessions: IExtendedSession[];
}) => {
  const { handleTermChange } = useSearchParams();
  const sortedSessions = sessions.sort((a, b) => {
    return (
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
    );
  });
  return (
    <>
      {sortedSessions.map((session) => (
        <div key={session._id} className="w-full px-4 py-2">
          <div
            className="cursor-pointer"
            onClick={() =>
              handleTermChange([{ key: 'previewId', value: session._id }])
            }
          >
            <VideoCard event={event} session={session} />
          </div>
        </div>
      ))}
    </>
  );
};

export default ClipsSessionList;
