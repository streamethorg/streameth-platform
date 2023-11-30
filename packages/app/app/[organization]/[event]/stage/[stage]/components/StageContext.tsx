'use client'
import { useState, createContext, useEffect } from 'react'
import { ISession } from '../../../../../../../server/model/session'
import { IStage } from '../../../../../../../server/model/stage'

export interface StageData {
  stage: IStage
  sessions: ISession[]
  currentSession: ISession
}

export const StageContext = createContext<StageData | null>(null)

interface props {
  stage: IStage
  sessions: ISession[]
  children: React.ReactNode
}

export const StageContextProvider = (props: props) => {
  const [currentSession, setCurrentSession] = useState<ISession>(
    props.sessions[0]
  )
  const [sessions, setSessions] = useState<ISession[]>(props.sessions)

  const value = {
    stage: props.stage,
    sessions,
    currentSession,
    setCurrentSession,
  }

  return (
    <StageContext.Provider value={value}>
      {props.children}
    </StageContext.Provider>
  )
}
