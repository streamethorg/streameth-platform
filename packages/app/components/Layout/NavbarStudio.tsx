import React from 'react';
import Image from 'next/image';
import SearchBar from '@/components/misc/SearchBar';
import Link from 'next/link';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { IExtendedOrganization } from '@/lib/types';
import UserProfile from '@/components/misc/UserProfile';
import CreateLivestreamModal from '@/app/studio/[organization]/livestreams/components/CreateLivestreamModal';
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
    <NavigationMenu className="h-18 w-full hidden sticky top-0 flex items-center p-2 px-4 bg-white md:hidden lg:flex z-[30]">
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
      <div className="flex items-center justify-end space-x-2">
        <CreateLivestreamModal organization={organization} />
        <UploadVideoDialog organizationId={organization._id.toString()} />
        {organizations && (
          <UserProfile
            organization={organization._id}
            organizations={organizations}
          />
        )}
      </div>
    </NavigationMenu>
  );
};

export default NavbarStudio;
