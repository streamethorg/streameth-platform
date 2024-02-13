'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { useNavigation } from '../navigation/navigationContext'
import { deleteStageAction } from '@/lib/actions/stages'
import { IExtendedEvent } from '@/lib/types'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const StageAccordion = ({
  stages,
  event,
}: {
  stages: IStageModel[]
  event: IExtendedEvent
}) => {
  const router = useRouter()
  const {
    selectedStage,
    setSelectedStage,
    selectedStageSetting,
    setSelectedStageSetting,
    setSelectedSetting,
  } = useNavigation()

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
      defaultValue={selectedStage}
      onValueChange={() => setSelectedSetting('stages')}>
      {stages.map((stage) => {
        return (
          <AccordionItem
            className="px-2"
            key={stage._id}
            value={stage.name}
            onClick={() => {
              setSelectedStage(stage._id)
            }}>
            <AccordionTrigger>{stage.name}</AccordionTrigger>
            <AccordionContent
              onClick={() => {
                setSelectedStageSetting('settings')
              }}>
              <p
                className={`${
                  selectedStageSetting === 'settings' &&
                  'border-l border-primary'
                } px-2`}>
                Livestream settings
              </p>
            </AccordionContent>
            <AccordionContent
              onClick={() => {
                setSelectedStageSetting('clip')
              }}>
              <p
                className={`${
                  selectedStageSetting === 'clip' &&
                  'border-l border-primary'
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
