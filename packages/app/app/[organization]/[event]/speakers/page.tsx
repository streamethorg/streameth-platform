import SpeakerPageComponent from './components/SpeakerComponent'
import EmbedLayout from '@/components/Layout/EmbedLayout'
import { fetchEvent } from '@/lib/data-back'
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
    event: params.event,
    organization: params.organization,
  })

  if (!event) return notFound()

  return (
    <EmbedLayout>
      <SpeakerPageComponent event={event} />
    </EmbedLayout>
  )
}

export default SpeakerPage
