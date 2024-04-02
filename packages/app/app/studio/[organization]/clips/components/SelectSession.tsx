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
import { IExtendedStage } from '@/lib/types'

const SelectSession = ({
  stages,
  currentStageId,
}: {
  stages: IExtendedStage[]
  currentStageId?: string
}) => {
  const { handleTermChange } = useSearchParams()

  const options = stages.map((stage) => ({
    label: stage.name,
    value: stage._id as string,
  }))

  const currentStage = options.find(
    (option) => option.value === currentStageId
  )

  return (
    <div className="flex flex-col space-y-2 w-full ">
      <p className="text-sm font-bold">Livestream</p>
      <Select
        value={currentStage?.value}
        onValueChange={(value) =>
          handleTermChange([
            {
              key: 'stage',
              value,
            },
          ])
        }>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select a livestream" />
        </SelectTrigger>
        <SelectContent className="bg-white">
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
