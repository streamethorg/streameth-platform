'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils/utils';
import { useRouter } from 'next/navigation';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

interface FeatureButtonProps {
  children: ReactNode;
  variant?: ButtonProps['variant'];
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  forceLockedState?: boolean;
}

const FeatureButton = ({
  children,
  variant = 'default',
  className,
  onClick,
  disabled,
  size = 'default',
  loading,
  type = 'button',
  forceLockedState = false,
}: FeatureButtonProps) => {
  const router = useRouter();
  const { canUseFeatures, organizationId } = useOrganizationContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!canUseFeatures || forceLockedState) {
      event.preventDefault();
      event.stopPropagation();
      router.push(`/studio/${organizationId}/payments`);
      return;
    }
    onClick?.();
  };

  const isLocked = !canUseFeatures || forceLockedState;

  return (
    <Button
      variant={variant}
      className={cn(className, 'relative', isLocked && 'opacity-60')}
      onClick={handleClick}
      disabled={disabled}
      size={size}
      type={type}
      loading={loading}
    >
      {isLocked && !loading && <Lock className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
};

export default FeatureButton;
