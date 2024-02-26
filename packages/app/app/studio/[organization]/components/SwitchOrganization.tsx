'use client'
import Combobox from '@/components/ui/combo-box'
import React from 'react'
import { useRouter } from 'next/navigation'
import { IExtendedOrganization } from '@/lib/types'
const SwitchOrganization = ({
  organization,
  organizations = [],
}: {
  organization?: string
  organizations?: IExtendedOrganization[]
}) => {
  const router = useRouter()
  return (
    <div>
      <Combobox
        items={organizations as any[]}
        valueKey="slug"
        labelKey="name"
        value={organization || ''}
        setValue={(org) => {
          router.push(`/studio/${org}`)
        }}
      />
    </div>
  )
}

export default SwitchOrganization
