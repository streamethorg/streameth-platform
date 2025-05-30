'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IExtendedSession } from '@/lib/types';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { Clapperboard } from 'lucide-react';
import { useState } from 'react';
import Preview from '../../../../(no-side-bar)/clips/[stageId]/sidebar/clips/Preview';
import { Card, CardContent } from '@/components/ui/card';
import { LuScissorsLineDashed } from 'react-icons/lu';

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
    return (
      <div className="flex flex-col items-center justify-center mt-14 text-muted-foreground">
        There are no clips yet.
        <Link href={`/studio/${organizationSlug}/clips`}>
          <Button variant="primary" className="mt-2">
            Create a clip
            <LuScissorsLineDashed className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
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
  return (
    <>
      <Card className="overflow-hidden m-2 py-2 px-2  cursor-pointer">
        <CardContent className="flex justify-between items-center m-0 p-0 lg:p-0">
          <div
            onClick={() => setIsOpen(true)}
            className="flex w-full items-center gap-2"
          >
            <div className="flex-shrink-0 w-1/3">
              <Thumbnail imageUrl={session.coverImage} />
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
      <Preview isOpen={isOpen} session={session} setIsOpen={setIsOpen} />
    </>
  );
};

export default ClipsList;
