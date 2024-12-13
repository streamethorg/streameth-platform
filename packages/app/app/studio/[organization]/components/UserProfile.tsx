'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { LayoutDashboard, Home, Users, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { IExtendedOrganization } from '@/lib/types';

const UserProfile = ({
  organization,
}: {
  organization: IExtendedOrganization;
}) => {
  const pathname = usePathname();
  const isInStudio = pathname.includes('/studio');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Image
            src={organization.logo}
            alt="Organization Logo"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm font-medium">{organization.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {!isInStudio && (
          <DropdownMenuItem>
            <Link
              href={`/studio/${organization.slug}`}
              className="flex items-center w-full"
            >
              <Button
                className="hidden items-center space-x-2 lg:flex"
                variant={'link'}
              >
                <LayoutDashboard size={16} />
                <span>View studio</span>
              </Button>
            </Link>
          </DropdownMenuItem>
        )}
        {isInStudio && (
          <DropdownMenuItem>
            <Link
              href={`/${organization.slug}`}
              className="flex items-center w-full"
            >
              <Button
                className="hidden items-center space-x-2 lg:flex"
                variant={'link'}
              >
                <Home size={16} />
                <span>View channel page</span>
              </Button>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Link href={`/studio`} className="flex items-center w-full">
            <Button
              className="hidden items-center space-x-2 lg:flex"
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
              className="hidden items-center space-x-2 lg:flex"
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
