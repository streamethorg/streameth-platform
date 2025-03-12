'use client';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import AddTeamMembers from './AddTeamMembers';

const AddTeamMembersWrapper = () => {
  const { organization, organizationId } = useOrganizationContext();
  
  // Only allow team member addition for pro and studio tiers
  const canAddMembers = 
    organization.subscriptionTier === 'pro' || 
    organization.subscriptionTier === 'studio';
  
  if (!canAddMembers) {
    return (
      <div className="border border-amber-200 bg-amber-50 p-4 rounded-md">
        <p className="text-amber-700 text-sm">
          Upgrade to Pro or Studio tier to add team members.
        </p>
      </div>
    );
  }
  
  return <AddTeamMembers organizationId={organizationId} />;
};

export default AddTeamMembersWrapper; 