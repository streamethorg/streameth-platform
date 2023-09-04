'use client'
import React, { useState, createContext, useEffect, ReactNode } from 'react'
import { DayInfo, ScheduleResponse } from '@/app/api/organizations/[id]/events/[eventId]/schedule/route'
import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'
import { LoadingContext } from '@/components/context/LoadingContext'
import { getScheduleData } from '@/utils/api'

interface ScheduleContextProps {
  data: DayInfo | null
  setDate: React.Dispatch<React.SetStateAction<number>>
  date: number | null
  dates: number[]
  setStage: React.Dispatch<React.SetStateAction<string | null>>
  stage: string | null
  stages: IStage[]
  totalSlots: number
  earliestTime: number
}

const ScheduleContext = createContext<ScheduleContextProps>({
  data: null,
  setDate: () => {},
  date: null,
  dates: [],
  setStage: () => {},
  stage: null,
  stages: [],
  totalSlots: 0,
  earliestTime: 0,
})

interface ScheduleContextProviderProps {
  event: IEvent
  days: number[]
  stages: IStage[]
  children: ReactNode
}

const ScheduleContextProvider: React.FC<ScheduleContextProviderProps> = ({ event, days, stages, children }) => {
  const { setIsLoading } = React.useContext(LoadingContext)
  const [date, setDate] = useState<number>(event.start.getTime())
  const [stage, setStage] = useState<string | null>(null)
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getScheduleData({ event, day: date, stage })
        console.log(fetchedData)
        setSchedule(fetchedData)
      } catch (error) {
        console.error('Error fetching schedule:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [event, date, stage])

  const data = schedule?.data
  console.log(schedule)
  const getStages = () => {
    console.log(data)
    if (!data) return []
    let items = []
    const a = Object(data.days[date].stages)
    console.log(a)
    for (const item of Object(data.days[date].stages).keys()) {
      console.log(item)
      items.push(item.stage as IStage)
    }
    return items
  }
  return (
    <ScheduleContext.Provider
      value={{
        data: data?.days[date] || null,
        setDate,
        setStage,
        stage,
        stages: getStages(),
        totalSlots: schedule?.totalSlots || 0,
        earliestTime: schedule?.earliestTime || 0,
        date,
        dates: [...days],
      }}>
      {children}
    </ScheduleContext.Provider>
  )
}

export { ScheduleContext, ScheduleContextProvider }
