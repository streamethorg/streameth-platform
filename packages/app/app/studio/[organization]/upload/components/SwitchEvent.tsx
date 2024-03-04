'use client'

import Combobox from '@/components/ui/combo-box'
import React from 'react'
import { useRouter } from 'next/navigation'
import { IExtendedEvent } from '@/lib/types'

const SwitchEvent = ({
  event,
  events = [],
}: {
  event?: string
  events?: IExtendedEvent[]
}) => {
  const router = useRouter()

  return (
    <div>
      <Combobox
        items={events as any[]}
        valueKey="slug"
        labelKey="name"
        value={event || ''}
        setValue={(event) => {
          router.push(`event/upload?eventId=${event}`)
        }}
      />
    </div>
  )
}

export default SwitchEvent
