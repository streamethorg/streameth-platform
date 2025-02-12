'use client';

import FeatureButton from '@/components/ui/feature-button';
import { ScissorsLineDashed } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import Link from 'next/link';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const ClipContentButton = ({
  variant = 'outline',
}: {
  variant: ButtonProps['variant'];
}) => {
  const { canUseFeatures, subscriptionStatus, organization } =
    useOrganizationContext();

  if (!canUseFeatures && !subscriptionStatus.hasAvailableStages) {
    return (
      <FeatureButton variant="outline" className="flex items-center gap-2 h-10">
        <ScissorsLineDashed className="w-5 h-5" />
        <span>Clip Content</span>
      </FeatureButton>
    );
  }

  return (
    <Link
      href={`/studio/${organization._id}/library?layout=list&page=1&limit=20&clipable=true`}
    >
      <Button variant={variant} className="flex items-center gap-2 h-10">
        <ScissorsLineDashed className="w-5 h-5" />
        <span>Clip Content</span>
      </Button>
    </Link>
  );
};

export default ClipContentButton;
