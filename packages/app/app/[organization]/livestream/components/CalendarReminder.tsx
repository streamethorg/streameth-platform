'use client'

import { Button } from '@/components/ui/button'
import generateGoogleCalendar from '@/lib/utils/generateGoogleCalendar'

const CalendarReminder = ({
  eventName,
  description,
  start,
  end,
}: {
  eventName: string
  description: string
  start: string
  end: string
}) => {
  const handleAddToCalendar = () => {
    const url = generateGoogleCalendar({
      eventName,
      description,
      start: new Date(start),
      end: new Date(end),
    })

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button variant={'outline'} onClick={handleAddToCalendar}>
      Add to Google Calendar
    </Button>
  )
}

export default CalendarReminder
