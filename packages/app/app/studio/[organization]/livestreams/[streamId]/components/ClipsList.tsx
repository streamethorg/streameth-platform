'use client';

import VideoCard from '@/components/misc/VideoCard';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { IExtendedSession } from '@/lib/types';

const ClipsList = ({ sessions }: { sessions: IExtendedSession[] }) => {
  const { handleTermChange } = useSearchParams();
  const sortedSessions = sessions.sort((a, b) => {
    return (
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
    );
  });

  if (sortedSessions.length === 0) {
    return <div className="flex justify-center mt-10">No clips yet</div>;
  }

  return (
    <>
      {sortedSessions.map((session) => (
        <div key={session._id} className="py-2 px-4 w-full">
          <div
            className="cursor-pointer"
            onClick={() =>
              handleTermChange([{ key: 'previewId', value: session._id }])
            }
          >
            <VideoCard session={session} />
          </div>
        </div>
      ))}
    </>
  );
};

export default ClipsList;
