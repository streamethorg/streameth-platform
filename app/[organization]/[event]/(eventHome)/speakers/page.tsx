'use client'

import { useEffect, useState, useContext } from 'react'
import SpeakerCard from './components/SpeakerCard'
import { ModalContext } from '@/components/context/ModalContext'
import SpeakerModal from './components/SpeakerModal'
import { ISpeaker } from '@/server/model/speaker'
import { ISession } from '@/server/model/session'
import { apiUrl } from '@/server/utils'

interface Params {
  params: {
    organization: string
    event: string
    speaker: string
  }
}

const SpeakerPage = ({ params }: Params) => {
  const { openModal } = useContext(ModalContext)
  const [speakers, setSpeakers] = useState<ISpeaker[]>([])
  const [sessions, setSessions] = useState<ISession[] | null>(null) // Added state for sessions

  useEffect(() => {
    const fetchSpeakers = async () => {
      const { organization, event } = params
      const response = await fetch(`${apiUrl()}/organizations/${organization}/events/${event}/speakers`)
      if (!response.ok) {
        console.error('Failed to fetch speakers:', response.statusText)
        return
      }
      const speakersData = await response.json()
      setSpeakers(speakersData)
    }

    fetchSpeakers()
  }, [params])

  useEffect(() => {
    const fetchSessions = async () => {
      const { organization, event } = params
      const response = await fetch(`${apiUrl()}/organizations/${organization}/events/${event}/sessions`)
      if (!response.ok) {
        console.error('Failed to fetch sessions:', response.statusText)
        return
      }
      const sessionsData = await response.json()
      setSessions(sessionsData)
    }
    fetchSessions()
  }, [params])

  return (
    <div className="flex flex-col max-w-7xl w-full mx-auto p-2">
      <span className=" box-border flex flex-col justify-center p-2 bg-white shadow-b w-full my-4 text-5xl">Speakers</span>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 w-full">
        {speakers.map((speaker) => (
          <div key={speaker.id} className="hover:bg-gray-50 p-4 rounded-lg cursor-pointer transition-colors">
            <SpeakerCard speaker={speaker} onClick={() => openModal(<SpeakerModal speaker={speaker} sessions={sessions} />)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpeakerPage
