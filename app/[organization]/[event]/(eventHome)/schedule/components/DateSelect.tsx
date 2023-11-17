'use client'
import { useContext } from 'react'
import { ScheduleContext } from './ScheduleContext'

const DateSelect = ({ dates }: { dates: number[] }) => {
  const { setDate, date } = useContext(ScheduleContext)

  const handleDateChange = (date: string) => {
    const numericValue = Number(date)
    setDate(numericValue)
  }

  return (
    <select
      className="px-3 py-2 border border-accent shadow rounded-lg bg-inherit text-lg cursor-pointer w-full box-border "
      value={date ? date : ''}
      onChange={(e) => handleDateChange(e.target.value)}>
      {dates.map((dateNum) => (
        <option key={dateNum} value={dateNum}>
          {new Date(dateNum).toLocaleDateString()}
        </option>
      ))}
    </select>
  )
}

export default DateSelect
