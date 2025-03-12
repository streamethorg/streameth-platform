import { studioPageParams } from '@/lib/types';
import React from 'react';
import Support from '@/components/misc/Support';
import { fetchOrganization } from '@/lib/services/organizationService';
import { redirect } from 'next/navigation';
import { IExtendedOrganization } from '@/lib/types';
import {
  OrganizationContextProvider,
  SubscriptionStatus,
} from '@/lib/context/OrganizationContext';
import { fetchStages } from '@/lib/services/stageService';
import { fetchUser } from '@/lib/services/userService';
const calculateOrganizationStatus = (
  organization: IExtendedOrganization
): SubscriptionStatus => {
  let daysLeft = 0;
  let hasExpired = true;

  if (organization.subscriptionPeriodEnd) {
    const expiryDate = new Date(organization.subscriptionPeriodEnd);
    const now = new Date();
    daysLeft = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );
    hasExpired = daysLeft <= 0;
  }

  const isSubscriptionActive = organization.subscriptionStatus === 'active';
  const isFree = organization.subscriptionTier === 'free';
  
  // Free tier never expires
  if (isFree) {
    hasExpired = false;
  }

  return {
    isActive: isSubscriptionActive || isFree,
    isProcessing: organization.subscriptionStatus === 'past_due',
    isPending: organization.subscriptionStatus === 'trialing',
    isFailed: organization.subscriptionStatus === 'unpaid' || organization.subscriptionStatus === 'canceled',
    daysLeft,
    hasExpired,
    hasAvailableStages: isFree || isSubscriptionActive,
  };
};

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: studioPageParams['params'];
}) => {
  const currentOrganization = await fetchOrganization({
    organizationId: params.organization,
  });

  const user = await fetchUser();
  if (!user) {
    redirect('/studio');
  }

  if (!currentOrganization) {
    redirect('/studio');
  }
  const isOwner = user.organizations.includes(currentOrganization._id);

  if (!isOwner) {
    redirect('/studio');
  }

  const stages = await fetchStages({
    organizationId: params.organization,
  });

  if (!currentOrganization) {
    redirect('/studio');
  }

  const status = calculateOrganizationStatus(currentOrganization);
  
  // Fix: ensure free tier can always use features, regardless of expiry
  const isFree = currentOrganization.subscriptionTier === 'free';
  const canUseFeatures = isFree || (status.isActive && !status.hasExpired);
  
  const canCreateStages = canUseFeatures && status.hasAvailableStages;
  
  // Use subscription tier to determine max stages instead
  const maxStages = currentOrganization.subscriptionTier === 'free' ? 1 : 
                   currentOrganization.subscriptionTier === 'creator' ? 2 :
                   currentOrganization.subscriptionTier === 'pro' ? 5 : 10; // studio tier
  
  const stagesStatus = {
    currentStages: stages.length || 0,
    paidStages: maxStages, // Use calculated value instead of removed field
    isOverLimit: stages.length >= maxStages, // Compare with calculated max
  };

  return (
    <OrganizationContextProvider
      organization={currentOrganization}
      daysLeft={status.daysLeft}
      canUseFeatures={canUseFeatures}
      canCreateStages={canCreateStages}
      subscriptionStatus={status}
      stagesStatus={stagesStatus}
    >
      {children}
      <Support />
    </OrganizationContextProvider>
  );
};

export default Layout;
