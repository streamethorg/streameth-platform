'use client';

import React, { useState, Suspense, useLayoutEffect } from 'react';
import Image from 'next/image';
import SearchBar from '@/components/misc/SearchBar';
import Link from 'next/link';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';
import Navbar from './Navbar';
import { SignInUserButton } from '../misc/SignInUserButton';
import { Search } from 'lucide-react';
import { Page } from '@/lib/types';
import SwitchOrganization from '@/app/studio/[organization]/components/SwitchOrganization';
import { IExtendedOrganization } from '@/lib/types';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '../misc/ConnectWalletButton';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';

const HomePageNavbar = ({
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
  if (logo === '') {
    logo = undefined;
  }

  return (
    <Suspense fallback={null}>
      <MobileNavBar
        logo={logo}
        pages={pages}
        showSearchBar={showSearchBar}
        organizations={organizations}
        currentOrganization={currentOrganization || ''}
      />
      <PCNavBar
        showLogo={showLogo}
        logo={logo}
        pages={pages}
        showSearchBar={showSearchBar}
        organizations={organizations}
        currentOrganization={currentOrganization || ''}
      />
    </Suspense>
  );
};

const MobileNavBar = ({
  logo,
  pages,
  showSearchBar,
  organizations,
  currentOrganization,
}: {
  logo?: string;
  pages: Page[];
  showSearchBar: boolean;
  organizations?: IExtendedOrganization[];
  currentOrganization: string;
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const toggleSearch = () => setSearchVisible(!searchVisible);
  const toggleMenu = () => setMenuVisible(!menuVisible);

  useLayoutEffect(() => {
    if (menuVisible || searchVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [menuVisible, searchVisible]);

  return (
    <NavigationMenu className="sticky top-0 z-[9999] flex flex-row items-center bg-white lg:hidden">
      {(searchVisible || menuVisible) && (
        <div className="absolute left-0 top-0 h-[100vh] w-[100vw] bg-black bg-opacity-50" />
      )}

      {searchVisible && showSearchBar && (
        <div className="bg-secondary absolute bottom-[-56px] w-full">
          <SearchBar organizationSlug={currentOrganization} isMobile={true} />
        </div>
      )}
      <div
        className={cn(
          'relative flex h-full w-full flex-row items-center px-4 py-2',
          menuVisible && 'bg-background',
          searchVisible && showSearchBar && 'bg-background'
        )}
      >
        {organizations && (
          <div className="m-1 mr-2">
            <SwitchOrganization
              organization={currentOrganization}
              organizations={organizations}
            />
          </div>
        )}
        {showSearchBar && (
          <Link href={`/${currentOrganization}`}>
            <Image
              src={logo ?? '/logo.png'}
              alt="Logo"
              height={36}
              width={36}
              className="aspect-square h-full"
            />
          </Link>
        )}

        <div className="ml-auto flex items-center">
          {showSearchBar && (
            <button onClick={toggleSearch} className="p-2">
              {searchVisible ? (
                <X className="text-primary h-6 w-6" />
              ) : (
                <Search className="text-primary h-6 w-6" />
              )}
            </button>
          )}
          {pages.length > 0 && (
            <button onClick={toggleMenu} className="z-50">
              {!menuVisible ? (
                <Menu size={30} strokeWidth={2} className="" />
              ) : (
                <X size={30} strokeWidth={2} className="" />
              )}
            </button>
          )}
        </div>
        {menuVisible && (
          <Navbar organization={currentOrganization} pages={pages} />
        )}
      </div>
    </NavigationMenu>
  );
};

const PCNavBar = ({
  logo,
  pages,
  showSearchBar,
  showLogo,
  organizations,
  currentOrganization,
}: {
  logo?: string;
  pages: Page[];
  showLogo: boolean;
  showSearchBar: boolean;
  organizations?: IExtendedOrganization[];
  currentOrganization: string;
}) => {
  const { isConnected } = useAccount();
  const pathname = usePathname();
  const isStudio = pathname.includes('studio');
  return (
    <NavigationMenu className="sticky top-0 z-[30] hidden w-full flex-row items-center justify-between bg-white p-2 px-4 shadow-sm md:hidden lg:flex">
      <div className="flex flex-1 items-center justify-start">
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
          <Link href={`/${currentOrganization}`}>
            <Button className="hidden lg:block" variant={'primary'}>
              View channel page
            </Button>
          </Link>
        )}
      </div>
      <div className="mx-auto flex w-2/5 flex-grow-0 items-center justify-center">
        {showSearchBar && (
          <SearchBar
            searchVisible={showSearchBar}
            organizationSlug={currentOrganization}
          />
        )}
      </div>
      <div className="flex flex-1 items-center justify-end">
        {organizations && (
          <SwitchOrganization
            organization={currentOrganization}
            organizations={organizations}
          />
        )}
        <Navbar organization={currentOrganization} pages={pages} />
        {isConnected && (
          <div className="mr-2">
            <ConnectWalletButton />
          </div>
        )}
        {isStudio && <SignInUserButton />}
      </div>
    </NavigationMenu>
  );
};

export default HomePageNavbar;
