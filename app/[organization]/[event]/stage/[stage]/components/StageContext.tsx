'use client'
import { useState, createContext, useEffect } from 'react'
import { IStage } from '@/server/model/stage'
import { ISession } from '@/server/model/session'

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
  const [currentSession, setCurrentSession] = useState<ISession>(props.sessions[0])
  const [sessions, setSessions] = useState<ISession[]>(props.sessions)
  useEffect(() => {
    const updateSessions = () => {
      const currentTimestamp = new Date().getTime()
      const filteredSessions = props.sessions.filter((session) => {
        return new Date(session.start).getTime() > currentTimestamp
      })
      setSessions(filteredSessions)
      setCurrentSession(filteredSessions[0])
    }
    updateSessions()
    const interval = setInterval(() => updateSessions(), 1000 * 60)
    return () => clearInterval(interval)
  }, [props.sessions])

  const value = {
    stage: props.stage,
    sessions,
    currentSession,
    setCurrentSession,
  }

  return <StageContext.Provider value={value}>{props.children}</StageContext.Provider>
}
