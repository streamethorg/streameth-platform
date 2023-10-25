import SpeakerPageComponent from './components/SpeakerPageComponent'
interface Params {
  params: {
    organization: string
    event: string
    speaker: string
  }
}

const SpeakerPage = async ({ params }: Params) => {
  return <SpeakerPageComponent params={params} />
}

export default SpeakerPage
