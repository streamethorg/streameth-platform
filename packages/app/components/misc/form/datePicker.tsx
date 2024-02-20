import { CalendarSearch } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import cn from 'classnames'

export default function DatePicker({
  value,
  onChange,
}: {
  value: Date
  onChange: (value: Date) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] pl-3 text-left font-normal',
            !value && 'text-muted-foreground'
          )}>
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
          <CalendarSearch size={17} className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        <Calendar
          mode="single"
          selected={new Date(value)}
          onSelect={(date) => {
            onChange(date ?? new Date())
          }}
          disabled={(date) =>
            date <= new Date() || date < new Date('1900-01-01')
          }
          // disabled={(date) =>
          //   date > new Date() || date < new Date('1900-01-01')
          // }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
