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
  const selectedSort = organizations?.find(
    (o) => o?.slug === organization
  )?.name
  return (
    <div className="px-2">
      <Combobox
        items={organizations as any[]}
        logo
        valueKey="slug"
        labelKey="name"
        variant="ghost"
        value={selectedSort || ''}
        setValue={(org) => {
          router.push(`/studio/${org}`)
        }}
      />
    </div>
  )
}

export default SwitchOrganization
