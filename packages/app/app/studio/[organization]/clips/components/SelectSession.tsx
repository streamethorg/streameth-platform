'use client'
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { IStage } from '@/lib/types'

const SelectSession = ({
  stages,
  currentStageId,
}: {
  stages: IStage[]
  currentStageId?: string
}) => {
  const { handleTermChange } = useSearchParams()

  const options = stages.map((stage) => ({
    label: stage.name,
    value: stage.id,
  }))

  return (
    <div className='flex flex-col space-y-2'>
      <p>Select livestream</p>
      <Select
        defaultValue={currentStageId}
        onValueChange={(value) =>
          handleTermChange([
            {
              key: 'stage',
              value,
            },
          ])
        }>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectSession
