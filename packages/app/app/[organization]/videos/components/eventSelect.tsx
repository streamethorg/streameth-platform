'use client'
import useSearchParams from '@/lib/hooks/useSearchParams'
import Combobox from '@/components/ui/combo-box'
import { IExtendedEvent } from '@/lib/types'

const EventSelect = ({ events }: { events: IExtendedEvent[] }) => {
  const { handleTermChange, searchParams } = useSearchParams()
  const event = searchParams.get('event') || ''

  if (events.length === 0) {
    return null
  }

  return (
    <Combobox
      value={events.find((e) => e._id === event)?.name || ''}
      setValue={(value) => {
        handleTermChange([
          {
            key: 'event',
            value,
          },
        ])
      }}
      items={events.map((event) => ({
        label: event.name,
        value: event._id,
      }))}
    />
  )
}

export default EventSelect
