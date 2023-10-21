'use client'

import { useEffect, useState } from 'react'
import { apiUrl } from '@/server/utils'
import { IEvent } from '@/server/model/event'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Params {
  params: {
    organization: string
    event: string
    speaker: string
  }
}

const MarkDownComp = ({ params }: Params) => {
  const [event, setEvent] = useState<IEvent | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      const { organization, event } = params
      const response = await fetch(`${apiUrl()}/organizations/${organization}/events/${event}`)
      if (!response.ok) {
        console.error('Failed to fetch event:', response.statusText)
        return
      }
      const eventData = await response.json()
      setEvent(eventData)
    }

    fetchEvent()
  }, [params])

  if (!event) {
    return null
  }

  return (
    <>
      <Markdown remarkPlugins={[remarkGfm]}>{`# ${event.name}`}</Markdown>
      <Markdown remarkPlugins={[remarkGfm]}>{event.description}</Markdown>
    </>
  )
}

export default MarkDownComp
