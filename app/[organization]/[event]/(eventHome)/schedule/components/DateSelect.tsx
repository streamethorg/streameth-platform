'use client'
import { useContext } from 'react'
import { ScheduleContext } from './ScheduleContext'
import { MobileContext } from '@/components/context/MobileContext'

const DateSelect = ({ dates }: { dates: number[] }) => {
  const { setDate, date } = useContext(ScheduleContext)
  const { isMobile } = useContext(MobileContext)

  const handleDateChange = (date: string) => {
    const numericValue = Number(date)
    setDate(numericValue)
  }

  if (dates.length < 2) return null

  return (
    <div className="flex flex-row space-x-4 justify-center p-2 md:p-4 box-border">
      {isMobile ? (
        <select
          className="text-xl cursor-pointer font-bold w-full"
          value={date ? date : ''}
          onChange={(e) => handleDateChange(e.target.value)}>
          {dates.map((dateNum) => (
            <option key={dateNum} value={dateNum}>
              {new Date(dateNum).toLocaleDateString()}
            </option>
          ))}
        </select>
      ) : (
        dates.map((dateNum, index) => (
          <div
            className={`p-4 text-center text-xl font-bold ${
              date !== dateNum
                ? 'text-black cursor-pointer'
                : 'text-accent'
            }`}
            onClick={() => setDate(dateNum)}
            key={index}>
            {new Date(dateNum).toLocaleDateString()}
          </div>
        ))
      )}
    </div>
  )
}

export default DateSelect
