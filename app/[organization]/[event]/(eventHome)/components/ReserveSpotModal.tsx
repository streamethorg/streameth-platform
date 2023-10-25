'use client'
import React, { useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'
import { IEvent } from '@/server/model/event'
import useLocalStorage from '@/components/hooks/useLocalStorage'

interface props {
  event: IEvent
}

interface SignUp {
  email: string
  isSignedUp?: boolean
}

const ReserveSpotModal = ({
  event,
  user,
  setUser,
  submitEmail,
}: {
  event: IEvent
  user: SignUp
  setUser: (user: SignUp) => void
  submitEmail: () => void
}) => {
  return (
    <div className="px-10 py-4 flex flex-col max-w-lg">
      <h2 className="text-2xl font-bold">Sign up to {event.name}</h2>
      <p className="mt-4">Enter your email</p>
      <div className="flex flex-row w-full space-x-2 mt-4">
        <input className="border w-full rounded" type="email" onChange={(e) => setUser({ ...user, email: e.target.value })} />

        <button
          type="submit"
          className=" w-10 mx-auto p-2 border bg-accent text-white rounded text-lg hoover:text-accent"
          onClick={() => {
            submitEmail()
          }}>
          {'>'}
        </button>
      </div>
    </div>
  )
}

const ReserveSpotButton = ({ event }: props) => {
  const { openModal, closeModal } = useContext(ModalContext)
  const [user, setUser] = useLocalStorage<SignUp>(event.id, {
    email: '',
    isSignedUp: false,
  })

  // push email to db
  const submitEmail = () => {
    fetch(`/api/organizations/${event.organizationId}/events/${event.id}/signup`, {
      method: 'POST',
      body: JSON.stringify({ email: user.email, eventId: event.id }),
    }).then((res) => {
      if (res.ok) {
        setUser({ ...user, isSignedUp: true })
        closeModal()
      }
    })
  }

  if (user && user.isSignedUp) {
    return <div className="text-center p-2  border bg-accent text-white rounded text-lg hoover:text-accent w-[200px]">{"you're"} signed up!</div>
  }

  const handleClick = () => {
    openModal(<ReserveSpotModal event={event} user={user} setUser={setUser} submitEmail={submitEmail} />)
  }

  return (
    <button onClick={handleClick} className="p-2  border bg-accent text-white rounded text-lg hoover:text-accent w-[200px]">
      reserve a spot
    </button>
  )
}

export default ReserveSpotButton
