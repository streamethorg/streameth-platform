'use client'
import { useContext, useEffect } from 'react'
import { ScheduleContext } from './ScheduleContext'
import { MobileContext } from '@/components/context/MobileContext'
const DateSelect = () => {
  const { dates, setDate, date } = useContext(ScheduleContext)
  const { isMobile } = useContext(MobileContext)
  console.log(dates)
  return (
    <div className="flex flex-row space-x-4 justify-center p-2 md:p-4 box-border">
      {isMobile ? (
        <select className="text-xl cursor-pointer font-bold" value={date ? date : ""} onChange={(e) => setDate(e.target.value)}>
          {dates.map((date, index) => (
            <option key={date} value={index}>
              {date}
            </option>
          ))}
        </select>
      ) : (
        dates.map((dateString, index) => (
          <div className={` p-4 text-center text-xl font-bold ${ date !== dateString ? 'text-black cursor-pointer' : 'text-accent'}`} onClick={() => setDate(dateString)} key={index}>
            {dateString}
          </div>
        ))
      )}
    </div>
  )
}

export default DateSelect
