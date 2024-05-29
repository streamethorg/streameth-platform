'use client'
import { Button } from '@/components/ui/button'
import { updateAssetAction } from '@/lib/actions/sessions'
import { IExtendedSession } from '@/lib/types'
import React, { useState } from 'react'
import { toast } from 'sonner'

const GetHashButton = ({
  session,
}: {
  session: IExtendedSession
}) => {
  const [isGettingHash, setIsGetHash] = useState(false)
  const handleGetHash = async () => {
    setIsGetHash(true)
    await updateAssetAction(session)
      .then(() => {
        toast.success('Hash generated')
      })
      .catch(() => {
        toast.error('Failed to generate hash')
      })
      .finally(() => {
        setIsGetHash(false)
      })
  }
  return (
    <Button
      loading={isGettingHash}
      variant="primary"
      onClick={() => handleGetHash()}>
      get hash
    </Button>
  )
}

export default GetHashButton
