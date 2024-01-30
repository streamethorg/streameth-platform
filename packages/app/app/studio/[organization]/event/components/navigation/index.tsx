'use client'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import EventAccordion from '../eventSettings/eventAccordion'
import StagesAccordion from '../stageSettings/stagesAccordion'
import { useNavigation } from './navigationContext'
import { cn } from '@/lib/utils/utils'
import { Button } from '@/components/ui/button'
import CreateStageForm from '../stageSettings/createStageForm'
import Link from 'next/link'
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
        'w-2/6 min-w-[400px] h-full border-r flex flex-col',
        selectedStageSetting === 'clip' && 'hidden'
      )}>
      <div className="flex flex-row p-2 justify-between items-center border-b">
        <h3 className="text-2xl font-bold mt-4 mb-2">
          Event settings
        </h3>
      </div>
      <EventAccordion event={event} />
      <div className="flex flex-row p-2 justify-between items-center border-b">
        <h3 className="text-2xl font-bold mt-4 mb-2">Livestreams</h3>
        {stages.length > 0 && <CreateStageForm eventId={event._id} />}
      </div>
      {stages.length > 0 ? (
        <StagesAccordion stages={stages} />
      ) : (
        <div className="flex flex-row p-2 justify-between items-center border-b">
          <div className="text-sm text-gray-500">
            No livestreams yet. Create one to get started.
          </div>
          <Button className="" variant={'secondary'}>
            Create
          </Button>
        </div>
      )}
      <div className=" flex flex-row justify-between mt-auto p-2">
        <Button className="" variant={'outline'}>
          <Link href={`/studio/${event.organizationId}`}>Cancel</Link>
        </Button>
        {/* <Button className="" variant={'outline'}>
          Publish
        </Button> */}
      </div>
    </div>
  )
}

export default Navigation
