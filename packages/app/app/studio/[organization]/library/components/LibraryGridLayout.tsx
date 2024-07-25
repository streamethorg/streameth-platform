'use client';

import { IExtendedSession, eLayout } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import LayoutSelection from './LayoutSelection';
import VideoCardWithMenu from './misc/VideoCardWithMenu';
import { PopoverActions } from './misc/PopoverActions';
import VideoCardProcessing from '@/components/misc/VideoCard/VideoCardProcessing';

const LibraryGridLayout = ({
  sessions,
  organizationSlug,
}: {
  sessions: IExtendedSession[];
  organizationSlug: string;
}) => {
  return (
    <>
      <div className="space-y-2 px-4 py-2">
        <LayoutSelection />
        <Separator />
      </div>
      <div className="m-5 grid grid-cols-4 gap-4 overflow-auto">
        {sessions.map((session) => (
          <div key={session._id}>
            {session.videoUrl ? (
              <VideoCardWithMenu
                session={session}
                link={`/${organizationSlug}/watch?session=${session._id}`}
                DropdownMenuItems={PopoverActions({
                  organizationSlug: organizationSlug,
                  session: session,
                  layout: eLayout.grid,
                })}
              />
            ) : (
              <VideoCardProcessing session={session} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default LibraryGridLayout;
