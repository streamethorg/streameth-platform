'use client'
import React, { useState, createContext, ReactNode, useEffect } from 'react'
import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'

interface ScheduleContextProps {
  setDate: React.Dispatch<React.SetStateAction<number>>
  date: number
  stages: IStage[]
  setStages: any
  event?: IEvent
  schedulePosition: ISchedulePosition
  setSchedulePositions: any
}

interface ISchedulePosition {
  min: number
  max: number
  totalSlots: number
}
const ScheduleContext = createContext<ScheduleContextProps>({
  setDate: () => {},
  date: 0,
  setStages: () => {},
  stages: [],
  schedulePosition: { min: 0, max: 0, totalSlots: 0 },
  setSchedulePositions: () => {},
})

interface ScheduleContextProviderProps {
  event: IEvent
  days: number[]
  stages: IStage[]
  children: ReactNode
}

const ScheduleContextProvider: React.FC<ScheduleContextProviderProps> = (props) => {
  const [date, setDate] = useState<number>(props.event.start.getTime())
  const [stages, setStages] = useState<IStage[]>(props.stages)
  const [schedulePositions, setSchedulePositions] = useState<ISchedulePosition[]>([])
  const [schedulePosition, setSchedulePosition] = useState<ISchedulePosition>({ min: 0, max: 0, totalSlots: 0 })

  useEffect(() => {
    setSchedulePositions([])
  }, [date])

  useEffect(() => {
    if (!schedulePositions.length) return
    setSchedulePosition({ ...minMaxMaxTotalslots() })
  }, [schedulePositions])

  const updateEarliestTimes = (data: ISchedulePosition) => {
    setSchedulePositions((schedulePositions) => [...schedulePositions, data])
  }

  const minMaxMaxTotalslots = () => {
    if (!schedulePositions.length) {
      return { min: 0, max: 0, totalSlots: 0 }
    }

    let returnObj = {
      min: schedulePositions[0].min,
      max: schedulePositions[0].max,
      totalSlots: schedulePositions[0].totalSlots,
    }

    for (let i = 0; i < schedulePositions.length; i++) {
      if (schedulePositions[i].min < returnObj.min) {
        returnObj.min = schedulePositions[i].min
      }
      if (schedulePositions[i].max > returnObj.max) {
        returnObj.max = schedulePositions[i].max
      }
      if (schedulePositions[i].totalSlots > returnObj.totalSlots) {
        returnObj.totalSlots = schedulePositions[i].totalSlots
      }
    }

    return returnObj
  }

  return (
    <ScheduleContext.Provider
      value={{
        setDate,
        date,
        setStages,
        stages,
        event: props.event,
        schedulePosition,
        setSchedulePositions: updateEarliestTimes,
      }}>
      {props.children}
    </ScheduleContext.Provider>
  )
}

export { ScheduleContext, ScheduleContextProvider }
