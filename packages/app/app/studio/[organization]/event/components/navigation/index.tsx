'use client'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import EventAccordion from '../eventSettings/eventAccordion'
import StagesAccordion from '../stageSettings/stagesAccordion'
import { useNavigation } from './navigationContext'
import { cn } from '@/lib/utils/utils'
const Navigation = ({
  event,
  stages,
}: {
  event: IEventModel
  stages: IStageModel[]
}) => {
  const { selectedStageSetting } = useNavigation()
  return (
    <div
      className={cn(
        'w-2/6 min-w-[400px] h-full border-r',
        selectedStageSetting === 'clip' && 'hidden'
      )}>
      <EventAccordion event={event} />
      <StagesAccordion stages={stages} />
    </div>
  )
}

export default Navigation
