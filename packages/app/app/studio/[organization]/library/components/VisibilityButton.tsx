'use client';
import { Button } from '@/components/ui/button';
import { IExtendedSession } from '@/lib/types';
import { updateSessionAction } from '@/lib/actions/sessions';
import { Globe, Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { eVisibilty } from 'streameth-new-server/src/interfaces/session.interface';

const VisibilityButton = ({ session }: { session: IExtendedSession }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleVisibilityToggle = async () => {
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
        published: session.published,
      },
    })
      .then(() => {
        if (session.published === eVisibilty.public) {
          toast.success('Succesfully made your asset private');
        } else if (
          session.published === eVisibilty.private ||
          eVisibilty.unlisted
        ) {
          toast.success('Succesfully made your asset public');
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('Something went wrong...');
      });
  };

  return (
    <Button
      variant="ghost"
      className="w-full !justify-start space-x-2"
      onClick={handleVisibilityToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : session.published ? (
        <Lock className="w-4 h-4" />
      ) : (
        <Globe className="w-4 h-4" />
      )}
      <span>{session.published ? 'Unpublish' : 'Publish'}</span>
    </Button>
  );
};

export default VisibilityButton;
