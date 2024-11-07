'use client';

import { IExtendedSession } from '@/lib/types';
import { updateSessionAction } from '@/lib/actions/sessions';
import { Globe, Lock, Loader2, Users, Binoculars } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenuPortal,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { eVisibilty } from 'streameth-new-server/src/interfaces/session.interface';

const VisibilityButton = ({ session }: { session: IExtendedSession }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState(session.published!);

  const handleVisibilityToggle = (newVisibility: eVisibilty) => {
    setIsLoading(true);

    updateSessionAction({
      session: {
        _id: session._id,
        name: session.name,
        description: session.description,
        organizationId: session.organizationId,
        eventId: session.eventId,
        stageId: session.stageId,
        start: session.start ?? Number(new Date()),
        end: session.end ?? Number(new Date()),
        speakers: session.speakers ?? [],
        type: session.type ?? 'video',
        published: newVisibility,
      },
    })
      .then(() => {
        setVisibility(newVisibility);

        const messages = {
          [eVisibilty.public]: 'Successfully made your asset public',
          [eVisibilty.private]: 'Successfully made your asset private',
          [eVisibilty.unlisted]: 'Successfully made your asset unlisted',
        };

        toast.success(messages[newVisibility]);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('Something went wrong...');
      });
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <div className="flex justify-center items-center space-x-2">
            <Binoculars className="w-4 h-4" />
            <span>Visibility</span>
          </div>
        )}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="space-x-2 bg-gray-50">
          <DropdownMenuRadioGroup
            value={visibility}
            onValueChange={(value) =>
              handleVisibilityToggle(value as eVisibilty)
            }
            className="p-2 space-y-2"
          >
            <DropdownMenuRadioItem
              className="flex items-center space-x-2 cursor-pointer"
              value={eVisibilty.public}
            >
              <Globe className="w-4 h-4" />
              <span>Public</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="flex items-center space-x-2 cursor-pointer"
              value={eVisibilty.unlisted}
            >
              <Users className="w-4 h-4" />
              <span>Unlisted</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="flex items-center space-x-2 cursor-pointer"
              value={eVisibilty.private}
            >
              <Lock className="w-4 h-4" />
              <span>Private</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

export default VisibilityButton;
