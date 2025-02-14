'use client';

import React from 'react';
import Image from 'next/image';
import SearchBar from '@/components/misc/SearchBar';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import UserProfile from '@/components/misc/UserProfile';
import CreateLivestreamModal from '@/app/studio/[organization]/(root)/livestreams/components/CreateLivestreamModal';
import UploadVideoDialog from '@/app/studio/[organization]/(root)/library/components/UploadVideoDialog';

const NavbarStudio = ({
  showSearchBar = true,
}: {
  showSearchBar?: boolean;
}) => {
  return (
    <NavigationMenu className="h-[72px] w-full  sticky top-0 flex items-center p-2 px-4 bg-white md:hidden lg:flex z-[30]">
      <Image
        src={'/logo_dark.png'}
        alt="Logo"
        width={150}
        height={50}
        className="hidden lg:block"
      />
      <div className="flex flex-grow justify-center items-center">
        <SearchBar searchVisible={showSearchBar} isStudio={true} />
      </div>
      <div className="flex items-center justify-end space-x-2">
        <CreateLivestreamModal variant="outline" />
        <UploadVideoDialog />
        <UserProfile />
      </div>
    </NavigationMenu>
  );
};

export default NavbarStudio;
