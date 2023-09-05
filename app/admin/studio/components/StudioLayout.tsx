import { Editor } from './Editor'
import { EventInfo, StageInfo } from '../page'

interface Props {
  events: EventInfo[]
  stages: StageInfo[]
}

export default async function StudioLayout(props: Props) {
  return (
    <div className="p-4 container mx-auto">
      <Editor events={props.events} stages={props.stages} />
    </div>
  )
}
