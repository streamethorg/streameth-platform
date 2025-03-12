'use client';

import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { NewSubscriptionView } from './components/NewSubscriptionView';
import { ActiveSubscriptionView } from './components/ActiveSubscriptionView';
import { ExpiredSubscriptionView } from './components/ExpiredSubscriptionView';

export default function PaymentsPage() {
  const { 
    organization, 
    organizationId, 
    subscriptionStatus, 
    stagesStatus,
    daysLeft,
    subscriptionTier
  } = useOrganizationContext();

  // If never had a subscription or has free tier, show pricing tiers
  if (organization.subscriptionStatus === 'none' || 
      (organization.subscriptionTier === 'free' && organization.subscriptionStatus !== 'active')) {
    return <NewSubscriptionView organizationId={organizationId} />;
  }

  // If subscription has expired, show expired notice + pricing tiers
  if (subscriptionStatus.hasExpired || subscriptionStatus.isFailed) {
    return <ExpiredSubscriptionView 
      organizationId={organizationId}
      stagesStatus={stagesStatus}
    />;
  }

  // If subscription is active - show current status + add resources card
  if (subscriptionStatus.isActive) {
    return <ActiveSubscriptionView 
      organization={organization}
      organizationId={organizationId}
      daysLeft={daysLeft}
      stagesStatus={stagesStatus}
    />;
  }

  // Has had subscription before but not active - show expired notice + pricing tiers
  return <ExpiredSubscriptionView 
    organizationId={organizationId}
    stagesStatus={stagesStatus}
  />;
}
