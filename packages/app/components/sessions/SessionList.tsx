'use client'
import React, { useEffect } from 'react'
import Scroll, { Element } from 'react-scroll'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
import ScheduleCard from '@/app/[organization]/[event]/schedule/components/ScheduleCard'
interface Props {
  event: IEventModel
  sessions: ISessionModel[]
  currentSession?: ISessionModel
}

const scroll = Scroll.scroller

function NoSessionComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-60 m-4 p-4">
      <p className="text-gray-600">
        No sessions scheduled for this stage!
      </p>
    </div>
  )
}

export default function SessionList({
  event,
  sessions,
  currentSession,
}: Props) {
  const getCurrDaySessions = () => {
    return sessions.filter(
      (session) =>
        new Date(session.start).toLocaleDateString() ==
        new Date().toLocaleDateString()
    )
  }

  const sortedSessions = getCurrDaySessions().length
    ? getCurrDaySessions().sort((a, b) => {
        if (a.start < b.start) {
          return -1
        } else if (a.start > b.start) {
          return 1
        } else {
          return 0
        }
      })
    : sessions.slice().sort((a, b) => {
        if (a.start < b.start) {
          return -1
        } else if (a.start > b.start) {
          return 1
        } else {
          return 0
        }
      })

  useEffect(() => {
    if (currentSession) {
      scroll.scrollTo(currentSession.id, {
        duration: 1500,
        smooth: true,
        offset: 0,
        containerId: 'sessionList',
      })
    }
  }, [currentSession])

  if (sessions === undefined || sessions.length === 0) {
    return <NoSessionComponent />
  }

  return (
    <ul
      id="sessionList"
      className="h-full relative lg:overflow-scroll">
      {sortedSessions.map((i, index) => {
        if (i.name === 'Blank') return null
        return (
          <Element key={index} name={i.id}>
            <li id={i.id} className="mb-3 text-lg">
              <ScheduleCard
                event={event}
                session={i}
                showTime
                speakers
              />
            </li>
          </Element>
        )
      })}
    </ul>
  )
}
