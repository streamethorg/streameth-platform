import React from 'react'
import CreateOrganizationForm from '../../(home)/components/CreateOrganizationForm'
import { studioPageParams } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import SwitchOrganization from '../components/SwitchOrganization'
import { fetchUserAction } from '@/lib/actions/users'

const Settings = async ({
  params,
}: {
  params: studioPageParams['params']
  searchParams: {
    settingsActiveTab?: string
  }
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) return null
  const userData = await fetchUserAction({})

  return (
    <div className="p-12 flex items center">
      <Card className="w-full rounded-r-xl h-full bg-white shadow-none max-w-3xl border">
        <CardHeader>
          <CardTitle>Edit yout channel</CardTitle>
          <CardDescription>
            Header logo and description will appear on your channel
            page
          </CardDescription>
          <SwitchOrganization
            organization={params.organization}
            organizations={userData.organizations}
          />
        </CardHeader>
        <CardContent>
          <CreateOrganizationForm
            disableName={true}
            organization={organization}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings
