import SpeakerPageComponent from './components/SpeakerComponent'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import { fetchEvent } from '@/lib/data'
import { notFound } from 'next/navigation'

interface Params {
  params: {
    organization: string
    event: string
    speaker: string
  }
}

const SpeakerPage = async ({ params }: Params) => {
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
