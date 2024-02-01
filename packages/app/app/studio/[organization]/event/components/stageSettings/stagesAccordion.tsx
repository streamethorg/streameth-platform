'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { useNavigation } from '../navigation/navigationContext'
import { deleteStageAction } from '@/lib/actions/stages'

const StageAccordion = ({ stages }: { stages: IStage[] }) => {
  const {
    selectedStage,
    setSelectedStage,
    selectedStageSetting,
    setSelectedStageSetting,
    setSelectedSetting,
  } = useNavigation()

  const handleDeleteStage = (stageId: string, streamId: string) => {
    if (
      window.confirm('Are you sure you want to delete this stage?')
    ) {
      deleteStageAction({ stageId, streamId })
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
