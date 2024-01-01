'use client'
import { IStage } from 'streameth-server/model/stage'
import {
  useSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation'

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
    <select
      className="px-3 py-2 border border-accent shadow rounded-lg bg-inherit text-lg cursor-pointer box-border w-full "
      defaultValue={searchParams.get('stage') || stages[0].id}
      onChange={(e) => handleStageChange(e.target.value)}>
      {stages.map((stage) => (
        <option key={stage.name} value={stage.id}>
          {stage.name}
        </option>
      ))}
    </select>
  )
}

export default StageSelect
