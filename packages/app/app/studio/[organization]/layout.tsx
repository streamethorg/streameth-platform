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
import SidebarMenu from '@/components/Sidebar/SidebarMenu'
import Support from '@/components/misc/Support'

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

  return (
    <div className="flex flex-row w-screen h-screen">
      <SidebarMenu organizationSlug={params.organization} />
      <div className="flex flex-col w-full">
        <HomePageNavbar
          pages={[]}
          showLogo={false}
          showSearchBar={false}
          currentOrganization={params.organization}
          organizations={userData?.organizations}
        />

        <div className="top-[64px] overflow-hidden flex flex-col h-[calc(100vh-54px)] border-t border-secondary">
          {!hasOrganization(
            userData?.organizations,
            params.organization
          ) ? (
            <div className="flex flex-col justify-center items-center h-screen text-center w-4/5 mx-auto">
              Organization not found or You do not belong to this
              organization, switch organization or create a new one
              <div className="flex gap-5 mt-5">
                <SwitchOrganization
                  organizations={userData?.organizations}
                />
                <Link href="/studio/create">
                  <Button variant="primary">
                    Create Organization
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-row w-full h-full">
              <div className=" w-full h-full">
                {children}
                <Support />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Layout
