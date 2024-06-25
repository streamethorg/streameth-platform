'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import TextPlaceholder from '@/components/ui/text-placeholder'
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
        toast.error('Failed to generate hash, try again later')
      })
      .finally(() => {
        setIsGetHash(false)
      })
  }
  return (
    <div className="flex flex-col w-full">
      {session.ipfsURI ? (
        <>
          <Label>IPFS hash</Label>
          <TextPlaceholder text={session.ipfsURI} />
        </>
      ) : (
        <Button
          loading={isGettingHash}
          variant="default"
          className="bg-[#0b3a53] text-white"
          onClick={() => handleGetHash()}>
          Publish to IPFS
        </Button>
      )}
    </div>
  )
}

export default GetHashButton
