'use server';

import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import Footer from '@/components/Layout/Footer';
import { fetchOrganization } from '@/lib/services/organizationService';
import NotFound from '@/not-found';
import React from 'react';
import { OrganizationContextProvider } from '@/lib/context/OrganizationContext';
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


  if (!organization) {
    return NotFound();
  }

  return (
    <OrganizationContextProvider
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
      />
      <div className="h-full w-full flex-grow">
          {children}
        </div>
        <div className="sticky top-[100vh] mb-5">
          <Footer />
        </div>
    </div>
    </OrganizationContextProvider>
  );
};

export default Layout;
