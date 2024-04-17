import { studioPageParams } from '@/lib/types'
import React from 'react'
import { Button } from '@/components/ui/button'
import { fetchUserAction } from '@/lib/actions/users'
import SwitchOrganization from './components/SwitchOrganization'
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage'
import CheckAuthorization from '@/components/authorization/CheckAuthorization'
import { hasOrganization } from '@/lib/utils/utils'
import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Link from 'next/link'
import Navigation from './components/Navigation'
import { fetchOrganization } from '@/lib/services/organizationService'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: studioPageParams['params']
}) => {
  const isAuthorized = await CheckAuthorization()
  if (!isAuthorized) {
    return <AuthorizationMessage />
  }
  const userData = await fetchUserAction({})
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })
  if (!organization) return null

  return (
    <div className="w-screen h-screen flex flex-row">
      <Navigation organizationSlug={params.organization} />
      <div className="flex flex-col w-full">
        <HomePageNavbar
          pages={[]}
          showLogo={false}
          showSearchBar={false}
          currentOrganization={params.organization}
          organizations={userData?.organizations}
        />

        <div className="top-[64px] overflow-hidden flex flex-col h-[calc(100vh-64px)] border-t border-secondary">
          {!hasOrganization(
            userData?.organizations,
            params.organization
          ) ? (
            <div className="flex flex-col justify-center items-center h-screen">
              You do not belong to this organization, switch
              organization or create a new one
              <div className="flex gap-5 mt-5">
                <SwitchOrganization
                  organizations={userData?.organizations}
                />
                <Link href="/studio/create">
                  <Button>Create Organization</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex flex-row">
              <div className="w-full h-full overflow-y-auto">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Layout
