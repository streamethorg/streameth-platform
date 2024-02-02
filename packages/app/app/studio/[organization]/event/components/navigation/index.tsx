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
import { deleteEventAction } from '@/lib/actions/events'
const Navigation = ({
  event,
  stages,
}: {
  event: IEventModel
  stages: IStageModel[]
}) => {
  const { selectedStageSetting } = useNavigation()

  const handleDeleteEvent = (eventSlug: string) => {
    if (
      window.confirm('Are you sure you want to delete this event?')
    ) {
      deleteEventAction({ eventSlug })
    }
  }
  return (
    <div
      className={cn(
        'w-2/6 min-w-[400px] h-full border-r border-border flex flex-col text-foreground',
        selectedStageSetting === 'clip' && 'hidden'
      )}>
      <div className="flex flex-row p-2 justify-between items-center border-b border-border">
        <h3 className="text-2xl font-bold mt-4 mb-2 ">
          Event settings
        </h3>
      </div>
      <EventAccordion event={event} />
      <div className="flex flex-row p-2 justify-between items-center border-b border-border">
        <h3 className="text-2xl font-bold mt-4 mb-2">Livestreams</h3>
        {stages.length > 0 && <CreateStageForm eventId={event._id} />}
      </div>
      {stages.length > 0 ? (
        <StagesAccordion stages={stages} />
      ) : (
        <div className="flex flex-row p-2 justify-between items-center border-b border-border">
          <div className="text-sm ">
            No livestreams yet. Create one to get started.
          </div>
          <CreateStageForm eventId={event._id} />
        </div>
      )}
      <div className=" flex flex-row justify-between items-center mt-auto p-2">
        <Button className="" variant={'outline'}>
          <Link href={`/studio/${event.organizationId}`}>Cancel</Link>
        </Button>
        <Button
          onClick={() => handleDeleteEvent(event.slug!)}
          variant={'destructive'}>
          Delete
        </Button>
        {/* <Button className="" variant={'outline'}>
          Publish
        </Button> */}
      </div>
    </div>
  )
}

export default Navigation
