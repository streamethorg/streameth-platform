'use client';

import { Button } from '@/components/ui/button';
import generateGoogleCalendar from '@/lib/utils/generateGoogleCalendar';
import { CalendarPlus } from 'lucide-react';

const CalendarReminder = ({
  eventName,
  description,
  start,
  end,
}: {
  eventName: string;
  description: string;
  start: string;
  end: string;
}) => {
  const handleAddToCalendar = () => {
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
