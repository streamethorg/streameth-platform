import { studioPageParams } from '@/lib/types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { fetchUserAction } from '@/lib/actions/users';
import SwitchOrganization from '@/components/Layout/SwitchOrganization';
import { hasOrganization } from '@/lib/utils/utils';
import NavbarStudio from '@/components/Layout/NavbarStudio';
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
  const userData = await fetchUserAction();

  return (
    <div className="flex h-screen w-screen flex-col">
      <NavbarStudio
        showLogo={false}
        showSearchBar={false}
        currentOrganization={params.organization}
        organizations={userData?.organizations}
      />
      <div className=" flex-row top-[72px] flex h-[calc(100vh-72px)]">
        <SidebarMenu organizationSlug={params.organization} />

        <div className="w-full max-w-[calc(100%-73px)] h-full  flex-col overflow-hidden border-t ">
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
            <div className="flex h-full w-full flex-row ">
              {children}
              <Support />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
