'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import CreateStageForm from '../createStageForm'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { useNavigation } from './navigationContext'

const StageAccordion = ({ stages }: { stages: IStageModel[] }) => {
  const { handleTermChange, searchParams } = useSearchParams({
    key: 'stage',
  })
  const { selectedSetting, setSelectedSetting } = useNavigation()
  const currentStage = searchParams.get('stage') || ''

  return (
    <Accordion type="single" collapsible defaultValue={currentStage}>
      {stages.map((stage) => {
        return (
          <AccordionItem
            className="px-2"
            key={stage._id}
            value={stage.name}
            onClick={() => {
              handleTermChange(stage._id)
            }}>
            <AccordionTrigger>{stage.name}</AccordionTrigger>
            <AccordionContent
              onClick={() => {
                setSelectedSetting('settings')
              }}>
              <p
                className={`${
                  selectedSetting === 'settings' &&
                  'border-l border-primary'
                } px-2`}>
                Livestream settings
              </p>
            </AccordionContent>
            <AccordionContent
              onClick={() => {
                setSelectedSetting('clip')
              }}>
              <p
                className={`${
                  selectedSetting === 'clip' &&
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
