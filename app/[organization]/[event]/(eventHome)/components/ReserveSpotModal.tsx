'use client'
import React, { useState, useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'
import { IEvent } from '@/server/model/event'

const ReserveSpotModal = ({ event }: { event: IEvent }) => {
  const [email, setEmail] = useState<string>('')

  // push email to db
  const submitEmail = () => {
    fetch('/api/reserve-spot', {
      method: 'POST',
      body: JSON.stringify({ email, eventId: event.id }),
    })
  }

  return (
    <form onSubmit={submitEmail}>
      <p>enter ur email to reserve a spot</p>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">submit</button>
    </form>
  )
}

const ReserveSpotButton = ({ event }: { event: IEvent }) => {
  const { openModal } = useContext(ModalContext)

  const handleClick = () => {
    openModal(<ReserveSpotModal event={event} />)
  }

  return <button onClick={handleClick}>reserve a spot</button>
}
