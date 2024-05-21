import React, { Suspense } from 'react'
import CreateOrganizationForm from '../../(home)/components/CreateOrganizationForm'
import { studioPageParams } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import { Card, CardContent } from '@/components/ui/card'
import NavigationItem from './components/NavigationItem'
import TeamMembers from './components/TeamMembers'
import { fetchOrganizationMembers } from '@/lib/services/organizationService'

const Settings = async ({
  params,
  searchParams,
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

  const members = await fetchOrganizationMembers({
    organizationId: organization._id,
  })

  const paths = [
    {
      title: 'Basic Info',
      path: `basicInfo`,
    },
    {
      title: 'Team Members',
      path: `teamMembers`,
    },
  ]

  const renderComponent = () => {
    switch (searchParams?.settingsActiveTab) {
      case 'basicInfo':
      default:
        return (
          <CreateOrganizationForm
            disableName={true}
            organization={organization}
          />
        )

      case 'teamMembers':
        return (
          <TeamMembers
            members={members}
            organizationId={organization._id}
          />
        )
    }
  }

  return (
    <div className="mx-auto max-w-4xl w-full mt-12 flex flex-row">
      <div className=" rounded-l-xl w-1/4 bg-neutrals-100 p-6 space-y-4">
        <h1 className="text-2xl font-medium ">Settings</h1>
        <div className="space-y-4">
          {paths.map((path) => (
            <NavigationItem
              key={path.title}
              lable={path.title}
              path={path.path}
            />
          ))}
        </div>
      </div>
      <Card className="w-3/4 rounded-r-xl m-auto h-full bg-white border-none shadow-none">
        <CardContent>{renderComponent()}</CardContent>
      </Card>
    </div>
  )
}

export default Settings
