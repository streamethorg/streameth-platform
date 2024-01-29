'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import CreateStageForm from './createStageForm'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { useNavigation } from '../navigation/navigationContext'

const StageAccordion = ({ stages }: { stages: IStageModel[] }) => {
  const {
    selectedStage,
    setSelectedStage,
    selectedStageSetting,
    setSelectedStageSetting,
    setSelectedSetting,
  } = useNavigation()

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
          </AccordionItem>
        )
      })}
      <AccordionItem className="px-2 bg-accent " value="create">
        <AccordionTrigger>Add stage</AccordionTrigger>
        <AccordionContent className="p-2 space-y-8">
          <CreateStageForm />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default StageAccordion
