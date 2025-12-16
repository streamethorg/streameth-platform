import { IExtendedOrganization } from '../types';

// Define proper types for tier limits
type BooleanFeatures =
  | 'isLivestreamingEnabled'
  | 'isMultistreamEnabled'
  | 'isCustomChannelEnabled'
  | 'hasPrioritySupport';
type NumericFeatures = 'maxVideoLibrarySize' | 'maxSeats';
type TierFeatures = BooleanFeatures | NumericFeatures;

/**
 * Feature limits for each subscription tier
 */
export const tierLimits = {
  free: {
    maxVideoLibrarySize: 5,
    maxSeats: 1,
    isLivestreamingEnabled: false,
    isMultistreamEnabled: false,
    isCustomChannelEnabled: true,
    hasPrioritySupport: false,
  },
  creator: {
    maxVideoLibrarySize: 10,
    maxSeats: 1,
    isLivestreamingEnabled: true,
    isMultistreamEnabled: false,
    isCustomChannelEnabled: true,
    hasPrioritySupport: false,
  },
  pro: {
    maxVideoLibrarySize: 25,
    maxSeats: Infinity,
    isLivestreamingEnabled: true,
    isMultistreamEnabled: true,
    isCustomChannelEnabled: true,
    hasPrioritySupport: false,
  },
  studio: {
    maxVideoLibrarySize: Infinity,
    maxSeats: Infinity,
    isLivestreamingEnabled: true,
    isMultistreamEnabled: true,
    isCustomChannelEnabled: true,
    hasPrioritySupport: true,
  },
  none: {
    maxVideoLibrarySize: 0,
    maxSeats: 0,
    isLivestreamingEnabled: false,
    isMultistreamEnabled: false,
    isCustomChannelEnabled: false,
    hasPrioritySupport: false,
  },
};

/**
 * Check if a feature is available for the organization based on tier
 */
export function canUseFeature(
  organization: IExtendedOrganization,
  feature: BooleanFeatures
): boolean {
  const tier = organization?.subscriptionTier || 'none';
  const subscriptionStatus = organization?.subscriptionStatus || 'none';

  // Free tier always has access to its basic features
  if (tier === 'free') {
    return tierLimits.free[feature];
  }

  // Allow feature access if:
  // 1. Subscription is active
  // 2. Subscription is canceling (they keep access until period end)
  // 3. Subscription is in trial
  if (
    subscriptionStatus === 'active' ||
    subscriptionStatus === 'canceling' ||
    subscriptionStatus === 'trialing'
  ) {
    return tierLimits[tier as keyof typeof tierLimits][feature];
  }

  // For all other statuses (expired, failed, etc), revert to free tier features
  return tierLimits.free[feature];
}

/**
 * Check if the organization can use quantity-based features (e.g. video uploads)
 * This is separate from feature flags as quantities should be enforced differently
 */
export function canUseQuantityFeature(
  organization: IExtendedOrganization,
  currentQuantity: number,
  featureKey: 'maxVideoLibrarySize' | 'maxSeats'
): boolean {
  const tier = organization?.subscriptionTier || 'none';
  const subscriptionStatus = organization?.subscriptionStatus || 'none';

  // Get the limit based on current tier
  let limit = tierLimits[tier as keyof typeof tierLimits][featureKey];

  // If subscription is not active/canceling/trialing, use free tier limits
  if (
    subscriptionStatus !== 'active' &&
    subscriptionStatus !== 'canceling' &&
    subscriptionStatus !== 'trialing'
  ) {
    limit = tierLimits.free[featureKey];
  }

  // Infinity means no limit
  if (limit === Infinity) return true;

  // Check if current quantity is under the limit
  return currentQuantity < limit;
}

/**
 * Get the maximum number of videos in library
 */
export function getVideoLibraryLimit(
  organization: IExtendedOrganization
): number {
  const tier = organization?.subscriptionTier || 'none';
  const subscriptionStatus = organization?.subscriptionStatus || 'none';

  // Only apply if subscription is active
  if (subscriptionStatus === 'active') {
    return tierLimits[tier as keyof typeof tierLimits].maxVideoLibrarySize;
  }

  // Special case for free tier - always give them their limit
  if (tier === 'free') {
    return tierLimits.free.maxVideoLibrarySize;
  }

  return 0;
}

/**
 * Check if user can upload more videos based on subscription tier
 */
export function canUploadMoreVideos(organization: IExtendedOrganization): {
  canUpload: boolean;
  remaining: number;
  message?: string;
} {
  const tier = organization?.subscriptionTier || 'none';
  const subscriptionStatus = organization?.subscriptionStatus || 'none';
  const currentCount = organization?.currentVideoCount || 0;

  // Get the limit based on current tier
  let limit = tierLimits[tier as keyof typeof tierLimits].maxVideoLibrarySize;

  // If subscription is not active/canceling/trialing, use free tier limits
  // UNLESS they are already on the free tier
  if (
    tier !== 'free' &&
    subscriptionStatus !== 'active' &&
    subscriptionStatus !== 'canceling' &&
    subscriptionStatus !== 'trialing'
  ) {
    limit = tierLimits.free.maxVideoLibrarySize;
  }

  // Infinity means no limit
  if (limit === Infinity) {
    return {
      canUpload: true,
      remaining: Infinity,
    };
  }

  const remaining = limit - currentCount;
  const canUpload = remaining > 0;

  // Generate appropriate message based on status
  let message;
  if (canUpload) {
    if (remaining <= 3) {
      // Warn when close to limit
      message = `You have ${remaining} video upload${remaining === 1 ? '' : 's'} remaining in your ${tier} tier.`;
    }
  } else {
    if (tier === 'free') {
      message =
        "You've reached the upload limit for the free tier. Upgrade your subscription to upload more videos.";
    } else if (
      subscriptionStatus === 'active' ||
      subscriptionStatus === 'trialing'
    ) {
      message = `You've reached the upload limit for the ${tier} tier. Upgrade your subscription to upload more videos.`;
    } else if (subscriptionStatus === 'canceling') {
      message = `You've reached your upload limit. Your subscription will revert to the free tier at the end of your billing period.`;
    } else {
      message = `You've reached your upload limit. Please renew your subscription to upload more videos.`;
    }
  }

  return {
    canUpload,
    remaining,
    message,
  };
}

/**
 * Get the maximum number of seats available
 */
export function getMaxSeats(organization: IExtendedOrganization): number {
  const tier = organization?.subscriptionTier || 'none';
  const subscriptionStatus = organization?.subscriptionStatus || 'none';

  // Only apply if subscription is active
  if (subscriptionStatus === 'active') {
    return tierLimits[tier as keyof typeof tierLimits].maxSeats;
  }

  // Special case for free tier - always give them their limit
  if (tier === 'free') {
    return tierLimits.free.maxSeats;
  }

  return 0;
}
