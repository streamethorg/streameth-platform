'use client'
import React, { useContext } from 'react'
import CreateEventForm from './CreateEventForm' // Assuming you have this component
import { ModalContext } from '@/components/context/ModalContext'
import { Button } from '@/app/utils/Button'
import Link from 'next/link'
const AddOrganizationButton = ({ organization }: { organization: string }) => {
  return (
    <Button variant="green">
      <Link href={`/admin/${organization}/create`}>Create a new Event</Link>
    </Button>
  )
}

export default AddOrganizationButton
