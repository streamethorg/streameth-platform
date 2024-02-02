'use client'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import useSearchParams from '@/lib/hooks/useSearchParams'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const StageSelect = ({ stages }: { stages: IStage[] }) => {
  const { searchParams, handleTermChange } = useSearchParams({
    key: 'stage',
  })

  return (
    <Select
      defaultValue={searchParams.get('stage') || stages[0]?._id}
      onValueChange={(value: string) => handleTermChange(value)}>
      <SelectTrigger className="bg-white bg-opacity-10 rounded-lg border-white border-opacity-10">
        <SelectValue placeholder="Stage select" />
      </SelectTrigger>
      <SelectContent className="bg-white bg-opacity-10 rounded-lg border-white border-opacity-10">
        {stages.map((stage) => (
          <SelectItem key={stage._id} value={stage._id}>
            {stage.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default StageSelect
