import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { IExtendedOrganization } from '@/lib/types';
import { fetchOrganization } from '@/lib/services/organizationService';
import Link from 'next/link';
import { LayoutDashboard, Home, Users, LogOut } from 'lucide-react';

const UserProfile = async ({
  organization,
  organizations,
}: {
  organization: string;
  organizations: IExtendedOrganization[];
}) => {
  const data = await fetchOrganization({
    organizationSlug: organization,
  });

  if (!data) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Image
            src={data?.logo}
            alt="Organization Logo"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm font-medium">{data.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Link
            href={`/studio/${organization}`}
            className="flex items-center w-full"
          >
            <Button
              className="hidden lg:flex items-center space-x-2"
              variant={'link'}
            >
              <LayoutDashboard size={16} />
              <span>View studio</span>
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/${organization}`} className="flex items-center w-full">
            <Button
              className="hidden lg:flex items-center space-x-2"
              variant={'link'}
            >
              <Home size={16} />
              <span>View channel page</span>
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/studio`} className="flex items-center w-full">
            <Button
              className="hidden lg:flex items-center space-x-2"
              variant={'link'}
            >
              <Users size={16} />
              <span>Switch Accounts</span>
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/auth/logout" className="flex items-center w-full">
            <Button
              className="hidden lg:flex items-center space-x-2"
              variant={'link'}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
