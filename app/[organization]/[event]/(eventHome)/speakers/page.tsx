import SpeakerPageComponent from './components/SpeakerPageComponent'
import EmbedLayout from '@/components/Layout/EmbedLayout'
interface Params {
  params: {
    organization: string
    event: string
    speaker: string
  }
}

const SpeakerPage = async ({ params }: Params) => {
  return (
    <EmbedLayout>
      <SpeakerPageComponent params={params} />
    </EmbedLayout>
  )
}

export default SpeakerPage
