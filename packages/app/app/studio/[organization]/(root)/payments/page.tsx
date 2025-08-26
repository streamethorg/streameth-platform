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
    subscriptionTier,
  } = useOrganizationContext();

  // Determine which view to show based on priority
  const renderSubscriptionView = () => {
    // Priority 1: Active subscription - show current status
    if (subscriptionStatus.isActive) {
      return (
        <ActiveSubscriptionView
          organization={organization}
          organizationId={organizationId}
          daysLeft={daysLeft}
          stagesStatus={stagesStatus}
        />
      );
    }

    // Priority 2: Expired or failed subscription - show expired notice
    if (subscriptionStatus.hasExpired || subscriptionStatus.isFailed) {
      return (
        <ExpiredSubscriptionView
          organizationId={organizationId}
          stagesStatus={stagesStatus}
        />
      );
    }

    // Priority 3: Cancelled subscription - show expired notice with cancellation info
    if (organization.subscriptionStatus === 'canceling') {
      return (
        <ExpiredSubscriptionView
          organizationId={organizationId}
          stagesStatus={stagesStatus}
          isCancelled={true}
          subscriptionEndDate={
            organization.subscriptionPeriodEnd
              ? new Date(organization.subscriptionPeriodEnd)
              : undefined
          }
        />
      );
    }

    // Priority 4: No subscription or free tier - show pricing tiers
    if (
      organization.subscriptionStatus === 'none' ||
      (organization.subscriptionTier === 'free' &&
        organization.subscriptionStatus !== 'active')
    ) {
      return <NewSubscriptionView organizationId={organizationId} />;
    }

    // Priority 5: Any other case - show expired notice
    return (
      <ExpiredSubscriptionView
        organizationId={organizationId}
        stagesStatus={stagesStatus}
        subscriptionEndDate={
          organization.subscriptionPeriodEnd
            ? new Date(organization.subscriptionPeriodEnd)
            : undefined
        }
      />
    );
  };

  // Wrap all content in a scrollable container
  const content = (
    <div className="h-full w-full overflow-y-auto">
      <div className="min-h-full w-full">{renderSubscriptionView()}</div>
    </div>
  );

  return content;
}
