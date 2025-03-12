import { IExtendedOrganization } from '../types';

// Define proper types for tier limits
type BooleanFeatures = 'isMultistreamEnabled' | 'isCustomChannelEnabled' | 'isWhiteLabelEnabled' | 'hasPrioritySupport';
type NumericFeatures = 'maxVideoLibrarySize' | 'maxSeats';
type TierFeatures = BooleanFeatures | NumericFeatures;

/**
 * Feature limits for each subscription tier
 */
export const tierLimits = {
  free: {
    maxVideoLibrarySize: 5,
    maxSeats: 1,
    isMultistreamEnabled: false,
    isCustomChannelEnabled: false,
    isWhiteLabelEnabled: false,
    hasPrioritySupport: false,
  },
  creator: {
    maxVideoLibrarySize: 10,
    maxSeats: 1,
    isMultistreamEnabled: false,
    isCustomChannelEnabled: false,
    isWhiteLabelEnabled: false,
    hasPrioritySupport: false,
  },
  pro: {
    maxVideoLibrarySize: 25,
    maxSeats: Infinity,
    isMultistreamEnabled: true,
    isCustomChannelEnabled: true,
    isWhiteLabelEnabled: false,
    hasPrioritySupport: false,
  },
  studio: {
    maxVideoLibrarySize: 50,
    maxSeats: Infinity,
    isMultistreamEnabled: true,
    isCustomChannelEnabled: true,
    isWhiteLabelEnabled: true,
    hasPrioritySupport: true,
  },
  none: {
    maxVideoLibrarySize: 0,
    maxSeats: 0,
    isMultistreamEnabled: false,
    isCustomChannelEnabled: false,
    isWhiteLabelEnabled: false,
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
  // Handle subscription tier checks
  const tier = organization?.subscriptionTier || 'none';
  const subscriptionStatus = organization?.subscriptionStatus || 'none';
  
  // Only check subscription if status is active
  if (subscriptionStatus === 'active') {
    return tierLimits[tier as keyof typeof tierLimits][feature];
  }
  
  return false;
}

/**
 * Get the maximum number of videos in library
 */
export function getVideoLibraryLimit(organization: IExtendedOrganization): number {
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
  message?: string 
} {
  const tier = organization?.subscriptionTier || 'none';
  const subscriptionStatus = organization?.subscriptionStatus || 'none';
  const currentCount = organization?.currentVideoCount || 0;
  
  // Debug logging
  console.log('Video upload check:', {
    tier,
    subscriptionStatus,
    currentCount,
    maxSize: tierLimits[tier as keyof typeof tierLimits]?.maxVideoLibrarySize || 0
  });
  
  // Apply limit based on subscription status and tier
  if (subscriptionStatus === 'active' || tier === 'free') {
    const maxVideos = tierLimits[tier as keyof typeof tierLimits].maxVideoLibrarySize;
    const remaining = maxVideos - currentCount;
    
    if (remaining <= 0) {
      return { 
        canUpload: false, 
        remaining: 0,
        message: `You've reached the video limit (${maxVideos}) for your ${tier} subscription. Please upgrade to add more videos.`
      };
    }
    
    if (remaining <= 2) {
      return { 
        canUpload: true, 
        remaining,
        message: `You can upload ${remaining} more video${remaining === 1 ? '' : 's'} with your current ${tier} subscription.`
      };
    }
    
    return { 
      canUpload: true, 
      remaining
    };
  }
  
  return { 
    canUpload: false, 
    remaining: 0,
    message: 'Your subscription is not active. Please subscribe to upload videos.'
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