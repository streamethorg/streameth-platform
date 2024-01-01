'use client'
import {
  useSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation'

const DateSelect = ({ dates }: { dates: number[] }) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  function handleDateChange(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('date', term)
    } else {
      params.delete('date')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      className="px-3 py-2 border border-accent shadow rounded-lg bg-inherit text-lg cursor-pointer w-full box-border "
      defaultValue={searchParams.get('date') || dates[0]}
      onChange={(e) => handleDateChange(e.target.value)}>
      {dates.map((dateNum) => (
        <option key={dateNum} value={dateNum}>
          {new Date(dateNum).toDateString()}
        </option>
      ))}
    </select>
  )
}

export default DateSelect
