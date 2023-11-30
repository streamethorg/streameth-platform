'use client'

import React, { useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'
import { Button } from '@/app/utils/Button'
import EditOrganizationForm from './EditOranizationForm'
import { IOrganization } from '../../../../server/model/organization'

const EditOrganizationButton = ({
  organization,
}: {
  organization: IOrganization
}) => {
  const { openModal } = useContext(ModalContext)
  return (
    <Button
      variant="yellow"
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
