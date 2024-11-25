'use client';
import { useState } from 'react';
import { CalendarSearch } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import cn from 'classnames';

export default function DatePicker({
  value,
  onChange,
  allowPast = false,
}: {
  value: Date;
  onChange: (value: Date) => void;
  allowPast?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          variant={'outline'}
          className={cn(
            'w-[240px] pl-3 text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
          <CalendarSearch size={17} className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[99999999999999] w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={new Date(value)}
          fromDate={allowPast ? new Date('1900-01-01') : new Date()}
          onSelect={(date) => {
            onChange(date ?? new Date());
            setIsOpen(false);
          }}
          disabled={(date) =>
            !allowPast && (date == new Date() || date < new Date('1900-01-01'))
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
