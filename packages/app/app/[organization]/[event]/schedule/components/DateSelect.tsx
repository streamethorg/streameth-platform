'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useSearchParams from '@/lib/hooks/useSearchParams'

const DateSelect = ({ dates }: { dates: number[] }) => {
  const { searchParams, handleTermChange } = useSearchParams({
    key: 'date',
  })

  return (
    <Select
      defaultValue={searchParams.get('date') || dates[0].toString()}
      onValueChange={(value) => handleTermChange(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Date select" />
      </SelectTrigger>
      <SelectContent className="border-none">
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
