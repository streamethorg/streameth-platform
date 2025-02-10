
'use client';
import { useUserContext } from '@/lib/context/UserContext';
import CopyString from '@/components/misc/CopyString';

const InviteCode = () => {
  const { organization } = useUserContext();
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Invite code:</span>
      {organization.invitationCode && (
        <div className="w-fit rounded-md border">
          <CopyString item={organization.invitationCode} itemName="invitation code" />
        </div>
      )}
    </div>
  );
};

export default InviteCode;
