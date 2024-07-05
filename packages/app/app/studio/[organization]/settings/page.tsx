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

  return (
    <div className="items center flex p-12">
      <Card className="h-full w-full max-w-3xl rounded-r-xl border bg-white shadow-none">
        <CardHeader>
          <CardTitle>Edit yout channel</CardTitle>
          <CardDescription>
            Header logo and description will appear on your channel
            page
          </CardDescription>
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
