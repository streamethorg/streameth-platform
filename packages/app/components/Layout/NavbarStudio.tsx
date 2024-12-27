'use client';

import React from 'react';
import Image from 'next/image';
import SearchBar from '@/components/misc/SearchBar';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { IExtendedOrganization } from '@/lib/types';
import UserProfile from '@/components/misc/UserProfile';
import CreateLivestreamModal from '@/app/studio/[organization]/(root)/livestreams/components/CreateLivestreamModal';
import UploadVideoDialog from '@/app/studio/[organization]/(root)/library/components/UploadVideoDialog';
import LogoDark from '@/public/logo_dark.png';
const NavbarStudio = ({
  logo,
  showLogo = true,
  showSearchBar = true,
  organizations,
  currentOrganization,
}: {
  logo?: string;
  showLogo?: boolean;
  showSearchBar?: boolean;
  organizations?: IExtendedOrganization[];
  currentOrganization?: string;
}) => {
  const organization = organizations?.find(
    (org) => org?.slug?.toString() === currentOrganization
  );

  if (!organization) {
    return null;
  }

  return (
    <NavigationMenu className="flex sticky top-0 items-center p-2 px-4 w-full bg-white md:hidden lg:flex h-18 z-[30]">
      <Image
        src={'/logo_dark.png'}
        alt="Logo"
        width={230}
        height={50}
        className="hidden lg:block"
      />
      <div className="flex flex-grow justify-center items-center">
        <SearchBar
          searchVisible={showSearchBar}
          organizationId={organization._id.toString()}
          organizationSlug={organization?.slug ?? ''}
          isStudio={true}
        />
      </div>
      <div className="flex justify-end items-center space-x-2">
        <CreateLivestreamModal organization={organization} />
        <UploadVideoDialog organizationId={organization._id.toString()} />
        {organizations && <UserProfile organization={organization} />}
      </div>
    </NavigationMenu>
  );
};

export default NavbarStudio;
