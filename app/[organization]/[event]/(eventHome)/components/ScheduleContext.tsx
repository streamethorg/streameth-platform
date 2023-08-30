'use client'
import React, { useState, createContext, useEffect, ReactNode } from 'react'
import { DayData, ScheduleData } from '@/app/api/organizations/[id]/events/[eventId]/schedule/route'
import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'
import { LoadingContext } from '@/components/context/LoadingContext'
import { getScheduleData } from '@/utils/api'

interface ScheduleContextProps {
  data: DayData | null
  setDate: React.Dispatch<React.SetStateAction<string | null>>
  date: string | null
  dates: string[]
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
  days: string[]
  stages: IStage[]
  children: ReactNode
}

const ScheduleContextProvider: React.FC<ScheduleContextProviderProps> = ({ event, days, stages, children }) => {
  const { setIsLoading } = React.useContext(LoadingContext)
  const [date, setDate] = useState<string | null>(event.start.toISOString().split('T')[0])
  const [stage, setStage] = useState<string | null>(null)
  const [schedule, setSchedule] = useState<ScheduleData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getScheduleData({ event, day:date, stage })
        setSchedule(fetchedData)
      } catch (error) {
        console.error('Error fetching schedule:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [event, date, stage])
  const data = schedule?.data?.[0] || null
  return (  
    <ScheduleContext.Provider
      value={{
        data,
        setDate,
        setStage,
        stage,
        stages: data?.stages.map((stage) => stage.stage) || stages,
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
