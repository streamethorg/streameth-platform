'use client'
import { IStage } from 'streameth-server/model/stage'
import {
  useSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const StageSelect = ({ stages }: { stages: IStage[] }) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  function handleStageChange(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('stage', term)
    } else {
      params.delete('stage')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select
      defaultValue={searchParams.get('stage') || stages[0].id}
      onValueChange={(value) => handleStageChange(value)}>
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
