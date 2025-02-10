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
import { fetchOrganization } from '@/lib/services/organizationService';
import { UserContextProvider } from '@/lib/context/UserContext';
import { redirect } from 'next/navigation';

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: studioPageParams['params'];
}) => {
  const userData = await fetchUserAction();
  const currentOrganization = await fetchOrganization({
    organizationId: params.organization,
  });

  if (!hasOrganization(userData?.organizations, params.organization)) {
    redirect('/studio');
  }

  return (
    <UserContextProvider user={userData} organization={currentOrganization}>
      {children}
      <Support />
    </UserContextProvider>
  );
};

export default Layout;
