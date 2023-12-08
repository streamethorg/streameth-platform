'use client'
import { useContext, useEffect } from 'react'
import { ScheduleContext } from './ScheduleContext'
import moment from 'moment-timezone'

const DateSelect = ({ dates }: { dates: any[] }) => {
  const { setDate, date } = useContext(ScheduleContext)

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString()

    dates?.forEach((timestamp) => {
      const dateToCompare = new Date(
        moment(timestamp).tz('UTC').format('L')
      ).toLocaleDateString()
      if (dateToCompare === currentDate) {
        setDate(Number(timestamp))
      } else {
        return
      }
    })
  }, [])

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
          {new Date(
            moment(dateNum).tz('UTC').format('L')
          ).toLocaleDateString()}
        </option>
      ))}
    </select>
  )
}

export default DateSelect
