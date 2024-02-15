'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { deleteStageAction } from '@/lib/actions/stages'
import { IExtendedEvent } from '@/lib/types'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

const StageAccordion = ({
  stages,
  event,
}: {
  stages: IStageModel[]
  event: IExtendedEvent
}) => {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const router = useRouter()
  const stageSetting = searchParams.get('stageSetting')
  const selectedStage = searchParams.get('stage')

  const handleDeleteStage = async (
    stageId: string,
    organizationId: string,
    streamId: string
  ) => {
    if (
      window.confirm('Are you sure you want to delete this stage?')
    ) {
      await deleteStageAction({ stageId, organizationId, streamId })
        .then((response) => {
          if (response) {
            toast.success('Stage deleted')
          } else {
            toast.error('Error deleting stage')
          }
        })
        .catch(() => {
          toast.error('Error deleting stage')
        })
        .finally(() => {
          router.refresh()
        })
    }
  }
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={selectedStage as string}>
      {stages.map((stage) => {
        return (
          <AccordionItem
            className="px-2"
            key={stage._id}
            value={stage.name}>
            <AccordionTrigger
              onClick={() => {
                window.history.pushState(
                  null,
                  '',
                  `?eventId=${eventId}&setting=stages&stage=${stage._id}&stageSetting=settings`
                )
              }}>
              {stage.name}
            </AccordionTrigger>
            <AccordionContent
              onClick={() => {
                window.history.pushState(
                  null,
                  '',
                  `?eventId=${eventId}&setting=stages&stage=${stage._id}&stageSetting=settings`
                )
              }}>
              <p
                className={`${
                  stageSetting === 'settings' &&
                  'border-l border-primary'
                } px-2`}>
                Livestream settings
              </p>
            </AccordionContent>
            <AccordionContent
              onClick={() => {
                window.history.pushState(
                  null,
                  '',
                  `?eventId=${eventId}&setting=stages&stageSetting=clip`
                )
              }}>
              <p
                className={`${
                  stageSetting === 'clip' && 'border-l border-primary'
                } px-2`}>
                Clips
              </p>
            </AccordionContent>
            <AccordionContent
              onClick={() => {
                handleDeleteStage(
                  stage._id,
                  event?.organizationId as string,
                  stage.streamSettings.streamId ?? ''
                )
              }}>
              <p className={`px-2`}>Delete</p>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default StageAccordion
