'use server';

import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import Footer from '@/components/Layout/Footer';
import { fetchOrganization } from '@/lib/services/organizationService';
import NotFound from '@/not-found';
import Support from '@/components/misc/Support';
import { fetchUserAction } from '@/lib/actions/users';
import React from 'react';
import { UserContextProvider } from '@/lib/context/UserContext';

const Layout = async ({
  params,
  children,
}: {
  params: { organization: string };
  children: React.ReactNode;
}) => {
  const org = params.organization;
  const pages = [
    {
      name: 'Home',
      href: `/${org}`,
      bgColor: 'bg-muted',
    },
    {
      name: 'Videos',
      href: `/${org}/videos`,
      bgColor: 'bg-muted',
    },
  ];

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  const userData = await fetchUserAction();

  if (!organization) {
    return NotFound();
  }

  return (
    <UserContextProvider
      user={userData}
      organization={organization}
      daysLeft={0}
      canUseFeatures={false}
      canCreateStages={false}
      subscriptionStatus={{
        isActive: false,
        daysLeft: 0,
        hasExpired: false,
        isProcessing: false,
        isPending: false,
        isFailed: false,
        hasAvailableStages: false,
      }}
      stagesStatus={{
        currentStages: 0,
        paidStages: 0,
        isOverLimit: false,
      }}
    >
      <div className="mx-auto flex min-h-[100vh] w-full flex-col bg-white">
        <HomePageNavbar
        logo={organization?.logo}
        currentOrganization={organization._id}
        pages={pages}
        showSearchBar
        showLogo={true}
        organizations={userData?.organizations || null}
      />
      <div className="h-full w-full flex-grow">
          {children}
        </div>
        <div className="sticky top-[100vh] mb-5">
          <Footer />
        </div>
    </div>
    </UserContextProvider>
  );
};

export default Layout;
