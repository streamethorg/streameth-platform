'use client';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import CopyString from '@/components/misc/CopyString';

const InviteCode = () => {
  const { organization } = useOrganizationContext();
  
  // Only show invite code for pro and studio tiers
  const canUseInviteCode = 
    organization.subscriptionTier === 'pro' || 
    organization.subscriptionTier === 'studio';
  
  if (!canUseInviteCode) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-amber-600">
          Upgrade to Pro or Studio for team collaboration
        </span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Invite code:</span>
      {organization.invitationCode && (
        <div className="w-fit rounded-md border">
          <CopyString
            item={organization.invitationCode}
            itemName="invitation code"
          />
        </div>
      )}
    </div>
  );
};

export default InviteCode;
