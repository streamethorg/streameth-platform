'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchEventStages } from '@/lib/data'
import CreateStageForm from '../createStageForm'
import { IStage } from 'streameth-server/model/stage'
import useSearchParams from '@/lib/hooks/useSearchParams'
const StageAccordion = ({
  stages,
  selectedSetting,
  setSelectedSetting,
}: {
  stages: IStage[]
  selectedSetting: string
  setSelectedSetting: React.Dispatch<React.SetStateAction<string>>
}) => {
  const { handleTermChange, searchParams } = useSearchParams({
    key: 'stage',
  })

  const currentStage = searchParams.get('stage') || ''

  return (
    <Accordion type="single" collapsible defaultValue={currentStage}>
      {stages.map((stage) => {
        return (
          <AccordionItem
            className="px-2"
            key={stage.id}
            value={stage.id}
            onClick={() => {
              handleTermChange(stage.id)
            }}>
            <AccordionTrigger>{stage.name}</AccordionTrigger>
            <AccordionContent
              className={
                selectedSetting === 'settings'
                  ? 'bg-accent'
                  : '' + 'p-2 space-y-8'
              }
              onClick={() => {
                setSelectedSetting('settings')
              }}>
              {stage.name}
            </AccordionContent>
            <AccordionContent
              className={
                selectedSetting === 'clip'
                  ? 'bg-accent'
                  : '' + 'p-2 space-y-8'
              }
              onClick={() => {
                setSelectedSetting('clip')
              }}>
              CLips
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
