import { studioPageParams } from '@/lib/types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { fetchUserAction } from '@/lib/actions/users';
import SwitchOrganization from './components/SwitchOrganization';
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage';
import CheckAuthorization from '@/components/authorization/CheckAuthorization';
import { hasOrganization } from '@/lib/utils/utils';
import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import Link from 'next/link';
import SidebarMenu from '@/components/Sidebar/SidebarMenu';
import Support from '@/components/misc/Support';

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: studioPageParams['params'];
}) => {
  const isAuthorized = await CheckAuthorization();
  if (!isAuthorized) {
    return <AuthorizationMessage />;
  }
  const userData = await fetchUserAction({});

  return (
    <div className="flex h-screen w-screen flex-row">
      <SidebarMenu organizationSlug={params.organization} />
      <div className="flex w-full flex-col">
        <HomePageNavbar
          pages={[]}
          showLogo={false}
          showSearchBar={false}
          currentOrganization={params.organization}
          organizations={userData?.organizations}
        />

        <div className="border-secondary top-[54px] flex h-[calc(100vh-54px)] flex-col overflow-hidden border-t">
          {!hasOrganization(userData?.organizations, params.organization) ? (
            <div className="mx-auto flex h-screen w-4/5 flex-col items-center justify-center text-center">
              Organization not found or You do not belong to this organization,
              switch organization or create a new one
              <div className="mt-5 flex gap-5">
                <SwitchOrganization organizations={userData?.organizations} />
                <Link href="/studio/create">
                  <Button variant="outlinePrimary">Create Organization</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full flex-row">
              <div className="h-full w-full">
                {children}
                <Support />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
