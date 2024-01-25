'use client'
import React, { useContext, useEffect, useState } from 'react'
import { ModalContext } from '@/lib/context/ModalContext'
import useLocalStorage from '@/lib/hooks/useLocalStorage'
import { IEvent } from '@/lib/types'

interface props {
  event: IEvent
}

interface SignUp {
  email: string
  isSignedUp?: boolean
}

const ReserveSpotModal = ({ event }: { event: IEvent }) => {
  const { closeModal } = useContext(ModalContext)
  const [localIsLoading, setLocalIsLoading] = useState(false)
  const [user, setUser] = useLocalStorage<SignUp>(event.id, {
    email: '',
    isSignedUp: false,
  })

  const submitEmail = () => {
    setLocalIsLoading(true)
    fetch(
      `/api/organizations/${event.organizationId}/events/${event.id}/signup`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          eventId: event.id,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setUser({ ...user, isSignedUp: true })
          closeModal()
        }
      })
      .finally(() => {
        setLocalIsLoading(false)
        // reload page
        window.location.reload()
      })
  }
  return (
    <div className=" bg-base px-10 py-4 flex flex-col max-w-lg">
      <h2 className="text-2xl font-bold">Sign up to {event.name}</h2>
      <p className="mt-4">Enter your email</p>
      <div className="flex flex-row w-full space-x-2 mt-4">
        <input
          value={user.email}
          className="border w-full rounded"
          type="email"
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
          }
        />
        {localIsLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        ) : (
          <button
            type="submit"
            className=" w-10 mx-auto p-2 border bg-accent  rounded text-lg hoover:text-accent"
            onClick={() => {
              submitEmail()
            }}>
            {'>'}
          </button>
        )}
      </div>
    </div>
  )
}

const ReserveSpotButton = ({ event }: props) => {
  const { openModal } = useContext(ModalContext)
  const [user, setUser] = useState<SignUp>()

  useEffect(() => {
    if (window !== undefined) {
      const item = window.localStorage.getItem(event.id)
      if (item !== null) {
        setUser(JSON.parse(item))
      }
    }
  }, [event.id])
  if (user && user.isSignedUp) {
    return (
      <div className="text-center p-2  border bg-accent  rounded text-lg hoover:text-accent w-[200px]">
        {"you're"} signed up!
      </div>
    )
  }

  const handleClick = () => {
    openModal(<ReserveSpotModal event={event} />)
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 bg-accent  rounded text-lg hoover:text-accent w-[200px]">
      Get notified
    </button>
  )
}

export default ReserveSpotButton
