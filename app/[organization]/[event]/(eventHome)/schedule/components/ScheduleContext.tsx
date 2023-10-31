'use client'
import React, {
  useState,
  createContext,
  ReactNode,
  useEffect,
} from 'react'
import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'
import { ISession } from '@/server/model/session'
import { isSameDay } from '@/utils/time'
interface ScheduleContextProps {
  setDate: React.Dispatch<React.SetStateAction<number>>
  date: number
  stage: IStage['id']
  setStage: React.Dispatch<React.SetStateAction<IStage['id']>>
  event?: IEvent
  sessions: ISession[]
}

const ScheduleContext = createContext<ScheduleContextProps>({
  setDate: () => {},
  date: 0,
  setStage: () => {},
  stage: '',
  sessions: [],
  event: undefined,
})

interface ScheduleContextProviderProps {
  event: IEvent
  stage: IStage['id']
  children: ReactNode
  sessions: ISession[]
}

const ScheduleContextProvider: React.FC<
  ScheduleContextProviderProps
> = (props) => {
  const [date, setDate] = useState<number>(
    props.event.start.getTime()
  )
  const [stage, setStage] = useState<IStage['id']>(props.stage)
  const [sessions, setSessions] = useState<ISession[]>([])

  useEffect(() => {
    setSessions(
      props.sessions.filter((session) => {
        return (
          session.stageId === stage && isSameDay(date, session.start)
        ) 
      })
    )
  }, [date, stage])

  return (
    <ScheduleContext.Provider
      value={{
        setDate,
        date,
        setStage,
        stage,
        event: props.event,
        sessions,
      }}>
      {props.children}
    </ScheduleContext.Provider>
  )
}

export { ScheduleContext, ScheduleContextProvider }
