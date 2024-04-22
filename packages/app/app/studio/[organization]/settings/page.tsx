import React from 'react'
import CreateOrganizationForm from '../../(home)/components/CreateOrganizationForm'
import { studioPageParams } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import { Card, CardContent } from '@/components/ui/card'
import NavigationItem from './components/NavigationItem'

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

  const paths = [
    {
      title: 'Basic Info',
      path: `basicInfo`,
    },
    // {
    //   title: 'Users',
    //   path: `users`,
    // },
  ]

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
      <Card className="w-3/4 rounded-r-xl m-auto bg-white border-none shadow-none">
        <CardContent>
          <CreateOrganizationForm organization={organization} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings
