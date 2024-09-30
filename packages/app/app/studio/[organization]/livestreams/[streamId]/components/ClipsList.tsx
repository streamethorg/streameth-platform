'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IExtendedSession } from '@/lib/types';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import useGenerateThumbnail from '@/lib/hooks/useGenerateThumbnail';
import { Clapperboard } from 'lucide-react';
import { useState } from 'react';
import Preview from '../../../clips/[stageId]/sidebar/clips/Preview';
import { Card, CardContent } from '@/components/ui/card';

const ClipsList = ({
  sessions,
  organizationSlug,
}: {
  sessions: IExtendedSession[];
  organizationSlug: string;
}) => {
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
          organizationSlug={organizationSlug}
          key={session._id}
          session={session}
        />
      ))}
    </>
  );
};

const ClipItem = ({
  session,
  organizationSlug,
}: {
  session: IExtendedSession;
  organizationSlug: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const imageUrl = useGenerateThumbnail({ session });

  return (
    <>
      <Card className="overflow-hidden m-2 py-2 px-2  cursor-pointer">
        <CardContent className="flex justify-between items-center m-0 p-0 lg:p-0">
          <div
            onClick={() => setIsOpen(true)}
            className="flex w-full items-center gap-2"
          >
            <div className="flex-shrink-0 w-1/3">
              <Thumbnail imageUrl={session.coverImage} fallBack={imageUrl} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium line-clamp-2">
                {session.name}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-1">
                {session.description || 'No description provided'}
              </p>
            </div>
          </div>
          <Link
            href={`/studio/${organizationSlug}/library/${session._id}`}
            passHref
          >
            <Button variant="primary" className="w-20 h-8 ml-2">
              Edit
              <Clapperboard className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Preview
        isOpen={isOpen}
        organizationId={session.organizationId as string}
        session={session}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default ClipsList;
