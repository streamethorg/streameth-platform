'use client';

import React from 'react';
import Image from 'next/image';
import SearchBar from '@/components/misc/SearchBar';
import Link from 'next/link';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { Page } from '@/lib/types';
import { IExtendedOrganization } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { IconLeft } from 'react-day-picker';
import useSearchParams from '@/lib/hooks/useSearchParams';
import UserProfile from '@/app/studio/[organization]/components/UserProfile';
import CreateLivestreamModal from '@/app/studio/[organization]/livestreams/components/CreateLivestreamModal';
import UploadVideoDialog from '@/app/studio/[organization]/library/components/UploadVideoDialog';

const NavbarStudio = ({
  logo,
  pages,
  showLogo = true,
  showSearchBar = true,
  organizations,
  currentOrganization,
}: {
  logo?: string;
  pages: Page[];
  showLogo?: boolean;
  showSearchBar?: boolean;
  organizations?: IExtendedOrganization[];
  currentOrganization?: string;
}) => {
  const pathname = usePathname();
  const { searchParams } = useSearchParams();

  const showGoBack =
    pathname.includes('clips') && searchParams.has('videoType');

  const organization = organizations?.find(
    (org) => org?.slug?.toString() === currentOrganization
  );

  if (!organization) {
    return null;
  }

  return (
    <NavigationMenu className="h-18 w-full hidden sticky top-0 flex-row justify-between items-center p-2 px-4 bg-white md:hidden lg:flex z-[30]">
      <div className="flex flex-1 justify-start items-center">
        {showLogo && (
          <Link href={`/${currentOrganization}`}>
            <Image
              src={logo ?? '/logo_dark.png'}
              alt="Logo"
              width={logo ? 50 : 230}
              height={logo ? 50 : 30}
              className="hidden lg:block"
            />
          </Link>
        )}
        {organizations && (
          <div className="flex flex-row space-x-1">
            {showGoBack && (
              <Link href={`/studio/${currentOrganization}/clips`}>
                <Button className="hidden lg:block" variant={'outline'}>
                  <div className="flex items-center">
                    <IconLeft className="mr-1" /> Go back
                  </div>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-grow-0 justify-center items-center mx-auto w-2/5">
        <SearchBar
          searchVisible={showSearchBar}
          organizationId={organization._id.toString()}
          organizationSlug={organization?.slug ?? ''}
          isStudio={true}
        />
      </div>
      <div className="flex flex-row space-x-2">
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
