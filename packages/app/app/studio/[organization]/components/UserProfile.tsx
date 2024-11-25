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
          <Link href={`/${organization}`}>
            <Button className="hidden lg:block" variant={'link'}>
              View channel page
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/studio`}>
            <Button className="hidden lg:block" variant={'link'}>
              Switch Accounts
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/auth/logout" className="w-full">
            <Button className="hidden lg:block" variant={'link'}>
              Logout
            </Button>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
