'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConnectWalletButton } from './ConnectWalletButton';

import { Button } from '../ui/button';
import { IExtendedOrganization } from '@/lib/types';
import { Label } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

const UserDropdown = ({
  organization,
  organizations,
}: {
  organization?: string;
  organizations?: IExtendedOrganization[];
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-col">
        <Button variant="link">
          <span className="text-sm font-medium">My account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="py-2">
          <DropdownMenuItem>
            <ConnectWalletButton />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col"></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/auth/logout">
              <Button>Sign out</Button>
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
