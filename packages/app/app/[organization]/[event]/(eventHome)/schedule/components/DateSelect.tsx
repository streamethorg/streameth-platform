'use client'
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
    <Select
      defaultValue={searchParams.get('date') || dates[0].toString()}
      onValueChange={(value) => handleDateChange(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Date select" />
      </SelectTrigger>
      <SelectContent>
        {dates.map((dateNum) => (
          <SelectItem key={dateNum} value={dateNum.toString()}>
            {new Date(dateNum).toDateString()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default DateSelect
