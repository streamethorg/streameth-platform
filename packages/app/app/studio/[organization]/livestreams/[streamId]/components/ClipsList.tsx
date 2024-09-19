'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { IExtendedSession } from '@/lib/types';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import useGenerateThumbnail from '@/lib/hooks/useGenerateThumbnail';
import { Clapperboard } from 'lucide-react';

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
        <ClipItem
          key={session._id}
          session={session}
          handleTermChange={handleTermChange}
        />
      ))}
    </>
  );
};

const ClipItem = ({
  session,
  handleTermChange,
}: {
  session: IExtendedSession;
  handleTermChange: (params: { key: string; value: string }[]) => void;
}) => {
  const imageUrl = useGenerateThumbnail({ session });

  return (
    <div className="flex items-start py-2 px-4 w-full">
      <div
        className="cursor-pointer flex-shrink-0 mr-3"
        onClick={() =>
          handleTermChange([{ key: 'previewId', value: session._id }])
        }
      >
        <div className="w-[80px] h-[45px]">
          <Thumbnail imageUrl={session.coverImage} fallBack={imageUrl} />
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="text-sm font-medium truncate">{session.name}</h3>
        <p className="text-xs text-gray-400 truncate">
          {session.description || 'No description provided'}
        </p>
      </div>
      {/* TODO: add edit endpoint right now it does nothing*/}
      <Link href={'#'} passHref>
        <Button variant="primary" className="w-20 h-8 ml-2">
          Edit
          <Clapperboard className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default ClipsList;
