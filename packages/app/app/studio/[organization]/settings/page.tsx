import React from 'react'
import CreateOrganizationForm from '../../(home)/components/CreateOrganizationForm'
import { studioPageParams } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
const Settings = async ({ params }: studioPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) return null

  return (
    <div className='w-full  flex'>
      <div className='w-full max-w-4xl bg-white p-4 rounded-xl mx-auto my-4 border'>
        <CreateOrganizationForm organization={organization} />
      </div>
    </div>
  )
}

export default Settings
