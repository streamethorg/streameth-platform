'use client';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import CopyString from '@/components/misc/CopyString';
import { Button } from '@/components/ui/button';

const InviteCode = () => {
  const { organization } = useOrganizationContext();
  
  // Only show invite code for pro and studio tiers
  const canUseInviteCode = 
    organization.subscriptionTier === 'pro' || 
    organization.subscriptionTier === 'studio';
  
  if (!canUseInviteCode) {
    return (
      <div className="flex flex-col gap-2 border rounded-md p-2">
        <div className="flex items-center gap-2">

          <span className="text-sm font-medium text-amber-600">
            Team collaboration requires Pro or Studio plan
          </span>
        </div>
        <Button 
          variant="outline"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Upgrade plan
        </Button>
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
