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

  return (
    <div className="flex flex-row justify-center items-center max-h-14">
      {isMobile ? (
        <select className="text-xl cursor-pointer font-bold w-full p-2" value={date ? date : ''} onChange={(e) => handleDateChange(e.target.value)}>
          {dates.map((dateNum) => (
            <option key={dateNum} value={dateNum}>
              {new Date(dateNum).toLocaleDateString()}
            </option>
          ))}
        </select>
      ) : (
        dates.map((dateNum, index) => (
          <div
            className={`ml-auto w-[calc(100%-6rem)] p-2 text-center text-xl ${date !== dateNum ? 'text-black cursor-pointer' : 'text-black'}`}
            onClick={() => setDate(dateNum)}
            key={index}>
            {new Date(dateNum).toDateString().slice(0, 10)}
          </div>
        ))
      )}
    </div>
  )
}

export default DateSelect
