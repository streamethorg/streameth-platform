import SpeakerPageComponent from './components/SpeakerComponent'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import { fetchEvent } from '@/lib/services/eventService'
import { notFound } from 'next/navigation'
import { EventPageProps } from '@/lib/types'

const SpeakerPage = async ({ params }: EventPageProps) => {
  const event = await fetchEvent({
    eventId: params.event,
  })

  if (!event) return notFound()

  return (
    <EmbedLayout>
      <SpeakerPageComponent event={event} />
    </EmbedLayout>
  )
}

export default SpeakerPage
