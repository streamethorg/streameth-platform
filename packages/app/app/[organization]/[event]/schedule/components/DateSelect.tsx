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
    <div className="flex flex-col space-y-2">
      <span className="text-sm ">Date</span>
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
        <SelectTrigger className=" rounded-lg border bg-white">
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
    </div>
  )
}

export default DateSelect
