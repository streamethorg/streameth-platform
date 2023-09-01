import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'
import { Editor } from './Editor'

interface Props {
  events: IEvent[]
  stages: IStage[]
}

export default async function StudioLayout(props: Props) {
  return (
    <div className="p-4 container mx-auto">
      <Editor events={props.events} stages={props.stages} />
    </div>
  )
}
