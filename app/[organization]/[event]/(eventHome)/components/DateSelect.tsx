'use client'
import { useContext, useEffect } from 'react'
import { ScheduleContext } from './ScheduleContext'
import { MobileContext } from '@/components/context/MobileContext'
const DateSelect = () => {
  const { dates, setDate, date } = useContext(ScheduleContext)
  const { isMobile, isLoading } = useContext(MobileContext)

  useEffect(() => {
    if (isMobile) {
      setDate(dates[0])
    } else {
      setDate(null)
    }
  }, [isMobile])


  return (
    <div className="flex flex-row space-x-4 justify-center p-2 md:p-4 box-border">
      {isMobile ? (
        <select className="text-xl cursor-pointer font-bold" value={date} onChange={(e) => setDate(e.target.value)}>
          {dates.map((date, index) => (
            <option key={date} value={index}>
              {date}
            </option>
          ))}
        </select>
      ) : (
        dates.map((date, index) => (
          <div className="w-full p-4 text-center text-xl font-bold text-accent uppercase" key={date} onClick={() => setDate(date)}>
            {date}
          </div>
        ))
      )}
    </div>
  )
}

export default DateSelect
