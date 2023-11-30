'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/app/utils/Button'
const AddOrganizationButton = ({
  organization,
}: {
  organization: string
}) => {
  return (
    <Button variant="green">
      <Link href={`/admin/${organization}/create`}>
        Create a new Event
      </Link>
    </Button>
  )
}

export default AddOrganizationButton
