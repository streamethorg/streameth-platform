'use client'
import React from 'react'
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
