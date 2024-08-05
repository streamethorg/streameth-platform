'use client';
import EventAccordion from './eventAccordion';
import StagesAccordion from './stagesAccordion';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import CreateStageForm from '../stageSettings/createStageForm';
import Link from 'next/link';
import { IExtendedEvent, IExtendedStage } from '@/lib/types';
import { updateEventAction } from '@/lib/actions/events';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
const Navigation = ({
  event,
  stages,
  organizationId,
  organizationSlug,
}: {
  event: IExtendedEvent;
  stages: IExtendedStage[];
  organizationId: string;
  organizationSlug: string;
}) => {
  const handlePublishEvent = () => {
    updateEventAction({
      event: { ...event, unlisted: !event.unlisted },
    })
      .then((response) => {
        if (response) {
          toast.success('Event updated');
        } else {
          toast.error('Error publishing event');
        }
      })
      .catch(() => {
        toast.error('Error publishing event');
      });
  };
  return (
    <div
      className={cn(
        'flex h-full w-2/6 min-w-[400px] flex-col overflow-auto border-r border-border bg-white text-black'
      )}
    >
      <div className="flex flex-row items-center justify-between border-b border-border p-2">
        <h3 className="mb-2 mt-4 text-2xl font-bold">Event settings</h3>
        <Button
          onClick={handlePublishEvent}
          variant={!event.unlisted ? 'outline' : 'default'}
        >
          {event.unlisted ? 'Publish' : 'Unpublish'}
        </Button>
      </div>
      <EventAccordion organizationId={organizationId} event={event} />
      <div className="flex flex-row items-center justify-between border-b border-border p-2">
        <h3 className="mb-2 mt-4 text-2xl font-bold">Livestreams</h3>
        {stages.length > 0 && <CreateStageForm event={event} />}
      </div>
      {stages.length > 0 ? (
        <StagesAccordion
          organization={organizationSlug}
          event={event}
          stages={stages}
        />
      ) : (
        <div className="flex flex-row items-center justify-between border-b border-border p-2">
          <div className="text-sm">
            No livestreams yet. Create one to get started.
          </div>
          <CreateStageForm event={event} />
        </div>
      )}
      <div className="mt-auto flex flex-row items-center justify-between p-2">
        <Link
          href={`/studio/${organizationId}/event`}
          className="flex flex-row p-2 hover:underline"
        >
          <ArrowLeft /> exit event editor
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
