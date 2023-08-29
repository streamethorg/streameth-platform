'use client'
import React, { useState, createContext, useEffect, ReactNode } from 'react'
import { apiUrl } from '@/server/utils'
import { DayData, ScheduleData } from '@/app/api/organizations/[id]/events/[eventId]/schedule/route'
import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'
import { getEventDays } from '@/server/utils'

interface ScheduleContextProps {
  isLoading: boolean
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
  isLoading: true,
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
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<string | null>(event.start.toISOString().split('T')[0])
  const [stage, setStage] = useState<string | null>(null)
  const [schedule, setSchedule] = useState<ScheduleData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetching schedule', date, stage)
      try {
        setIsLoading(true)
        const fetchedData = await getData({ event, date, stage })
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
        isLoading,
        data,
        setDate,
        setStage,
        stage,
        stages,
        totalSlots: schedule?.totalSlots || 0,
        earliestTime: schedule?.earliestTime || 0,
        date,
        dates: days,
      }}>
      {children}
    </ScheduleContext.Provider>
  )
}

export { ScheduleContext, ScheduleContextProvider }

const getData = async ({ event, date, stage }: { event: IEvent; date?: string | null; stage?: string | null }) => {
  let url = `${apiUrl()}/organizations/${event.organizationId}/events/${event.id}/schedule`
  if (date) url += `?date=${date}`
  if (stage) url += `&stage=${stage}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch schedule')
  }
  const schedule: ScheduleData = await response.json()
  return schedule
}
