'use client'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import useSearchParams from '@/lib/hooks/useSearchParams'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const StageSelect = ({ stages }: { stages: IStageModel[] }) => {
  const { searchParams, handleTermChange } = useSearchParams({
    key: 'stage',
  })

  return (
    <Select
      defaultValue={searchParams.get('stage') || stages[0].id}
      onValueChange={(value) => handleTermChange(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Stage select" />
      </SelectTrigger>
      <SelectContent>
        {stages.map((stage) => (
          <SelectItem key={stage.id} value={stage.id}>
            {stage.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default StageSelect
