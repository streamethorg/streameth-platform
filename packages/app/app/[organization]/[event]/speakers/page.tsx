import SpeakerPageComponent from './components/SpeakerComponent'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import { fetchEvent } from '@/lib/data'
import { notFound } from 'next/navigation'
import { EventPageProps } from '@/lib/types'

const SpeakerPage = async ({ params }: EventPageProps) => {
  const event = await fetchEvent({
    eventSlug: params.event,
  })

  if (!event) return notFound()

  return (
    <EmbedLayout>
      <SpeakerPageComponent event={event} />
    </EmbedLayout>
  )
}

export default SpeakerPage
