'use client';

import { Button } from '@/components/ui/button';
import generateGoogleCalendar from '@/lib/utils/generateGoogleCalendar';
import { CalendarPlus } from 'lucide-react';

const CalendarReminder = ({
  eventName,
  description,
  start,
  end,
  organizationSlug,
  stageId,
}: {
  eventName: string;
  description: string;
  start: string;
  end: string;
  organizationSlug: string;
  stageId: string;
}) => {
  const handleAddToCalendar = () => {
    if (
      organizationSlug === 'swarm' &&
      stageId === '6748314bc7a19bdce8e0b99e'
    ) {
      window.open(
        'https://www.addevent.com/event/yR24028303',
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    const url = generateGoogleCalendar({
      eventName,
      description,
      start: new Date(start),
      end: new Date(end),
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Button
        className="hidden space-x-2 md:flex"
        variant={'outline'}
        onClick={handleAddToCalendar}
      >
        <CalendarPlus size={20} />
        <span>Add to Google Calendar</span>
      </Button>
      <Button className="space-x-2 md:hidden" onClick={handleAddToCalendar}>
        <CalendarPlus size={20} />
        <span>Add to Google Calendar</span>
      </Button>
    </>
  );
};

export default CalendarReminder;
