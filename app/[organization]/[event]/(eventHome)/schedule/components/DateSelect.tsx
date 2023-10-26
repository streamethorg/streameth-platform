'use client'
import { useContext } from 'react'
import { ScheduleContext } from './ScheduleContext'
import { MobileContext } from '@/components/context/MobileContext'

const DateSelect = ({ dates }: { dates: number[] }) => {
  const { setDate, date } = useContext(ScheduleContext)

  const handleDateChange = (date: string) => {
    const numericValue = Number(date)
    setDate(numericValue)
  }

  return (
    <div>
      <select className="text-xl cursor-pointer font-bold w-full p-2" value={date ? date : ''} onChange={(e) => handleDateChange(e.target.value)}>
        {dates.map((dateNum) => (
          <option key={dateNum} value={dateNum}>
            {new Date(dateNum).toLocaleDateString()}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DateSelect
