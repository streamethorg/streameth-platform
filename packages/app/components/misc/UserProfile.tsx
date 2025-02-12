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
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { useUserContext } from '@/lib/context/UserContext';
import { usePathname } from 'next/navigation';

const UserProfile = () => {
  const { organization, organizationId } = useOrganizationContext();
  const { user } = useUserContext();
  const organizations = user?.organizations || [];
  const currentRoute = usePathname();
  const isStudio = currentRoute.includes('/studio');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Image
            src={organization?.logo}
            alt="Organization Logo"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm font-medium">{organization.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {!isStudio && (
          <DropdownMenuItem>
            <Link
              href={`/studio/${organizationId}`}
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
        )}
        {isStudio && (
          <DropdownMenuItem>
            <Link
              href={`/${organizationId}`}
              className="flex items-center w-full"
            >
              <Button
                className="hidden lg:flex items-center space-x-2"
                variant={'link'}
              >
                <Home size={16} />
                <span>View channel page</span>
              </Button>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          {organizations.length <= 1 ? (
            <Link href="/studio/create" className="flex items-center w-full">
              <Button
                className="hidden lg:flex items-center space-x-2"
                variant={'link'}
              >
                <Users size={16} />
                <span>Create Organization</span>
              </Button>
            </Link>
          ) : (
            <Link href="/studio" className="flex items-center w-full">
              <Button
                className="hidden lg:flex items-center space-x-2"
                variant={'link'}
              >
                <Users size={16} />
                <span>Switch Accounts</span>
              </Button>
            </Link>
          )}
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
