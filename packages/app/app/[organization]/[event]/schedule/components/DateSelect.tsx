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
  const { searchParams, handleTermChange } = useSearchParams()

  return (
    <Select
      defaultValue={searchParams.get('date') || dates[0].toString()}
      onValueChange={(value) =>
        handleTermChange([
          {
            key: 'date',
            value,
          },
        ])
      }>
      <SelectTrigger className="bg-white bg-opacity-10 rounded-lg border-white border-opacity-10">
        <SelectValue placeholder="Date select" />
      </SelectTrigger>
      <SelectContent className="bg-white rounded-lg border-white border-opacity-10">
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
