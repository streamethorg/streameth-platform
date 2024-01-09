'use client'

import React, { useContext } from 'react'
import { ModalContext } from '@/lib/context/ModalContext'
import { Button } from '@/components/ui/button'
import EditOrganizationForm from './EditOranizationForm'
import { IOrganization } from 'streameth-server/model/organization'

const EditOrganizationButton = ({
  organization,
}: {
  organization: IOrganization
}) => {
  const { openModal } = useContext(ModalContext)
  return (
    <Button
      onClick={() =>
        openModal(
          <EditOrganizationForm organization={organization} />
        )
      }>
      Edit
    </Button>
  )
}

export default EditOrganizationButton
