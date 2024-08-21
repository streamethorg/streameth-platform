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
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { IconLeft } from 'react-day-picker';
import useSearchParams from '@/lib/hooks/useSearchParams';

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
  const pathname = usePathname();
  const { searchParams, handleTermChange } = useSearchParams();

  // Check if the URL contains the "clips" parameter and "selectedRecording"
  const showGoBack =
    pathname.includes('clips') && searchParams.has('selectedRecording');

  // Handle the "Go back" functionality
  const handleGoBack = () => {
    handleTermChange([{ key: 'selectedRecording', value: undefined }]);
  };

  useLayoutEffect(() => {
    if (menuVisible || searchVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [menuVisible, searchVisible]);

  return (
    <NavigationMenu className="flex sticky top-0 z-50 flex-row items-center bg-white lg:hidden">
      {(searchVisible || menuVisible) && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-50 h-[100vh] w-[100vw]" />
      )}

      {searchVisible && showSearchBar && (
        <div className="absolute w-full bottom-[-56px] bg-secondary">
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
        {showGoBack ? (
          <Button
            className="mr-2"
            variant="outline"
            size="sm"
            onClick={handleGoBack}
          >
            <IconLeft className="mr-1" /> Go back
          </Button>
        ) : (
          <Link href={`/${currentOrganization}`}>
            <Image
              src={logo ?? '/logo.png'}
              alt="Logo"
              height={36}
              width={36}
              className="h-full aspect-square"
            />
          </Link>
        )}

        <div className="flex items-center ml-auto">
          {showSearchBar && (
            <button onClick={toggleSearch} className="p-2">
              {searchVisible ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Search className="w-6 h-6 text-primary" />
              )}
            </button>
          )}
          {pages.length > 1 && (
            <button onClick={toggleMenu} className="z-50">
              {!menuVisible ? (
                <Menu size={30} strokeWidth={2} className="" />
              ) : (
                <X size={30} strokeWidth={2} className="" />
              )}
            </button>
          )}
        </div>
        {menuVisible ||
          (pages.length < 2 && (
            <Navbar organization={currentOrganization} pages={pages} />
          ))}
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
  const { searchParams, handleTermChange } = useSearchParams();
  const isStudio = pathname.includes('studio');

  // Check if the URL contains the "clips" parameter and "selectedRecording"
  const showGoBack =
    pathname.includes('clips') && searchParams.has('selectedRecording');

  // Handle the "Go back" functionality
  const handleGoBack = () => {
    handleTermChange([{ key: 'selectedRecording', value: undefined }]);
  };

  return (
    <NavigationMenu className="hidden sticky top-0 flex-row justify-between items-center p-2 px-4 w-full bg-white md:hidden lg:flex z-[30]">
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
              <Button
                className="hidden lg:block"
                variant={'outline'}
                onClick={handleGoBack}
              >
                <div className="flex items-center">
                  <IconLeft className="mr-1" /> Go back
                </div>
              </Button>
            )}
            <Link href={`/${currentOrganization}`}>
              <Button className="hidden lg:block" variant={'primary'}>
                View channel page
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-grow-0 justify-center items-center mx-auto w-2/5">
        {showSearchBar && (
          <SearchBar
            searchVisible={showSearchBar}
            organizationSlug={currentOrganization}
          />
        )}
      </div>
      <div className="flex flex-1 justify-end items-center">
        {organizations && (
          <SwitchOrganization
            organization={currentOrganization}
            organizations={organizations}
          />
        )}
        <Navbar organization={currentOrganization} pages={pages} />
        {/* {isConnected && (
          <div className="mr-2">
            <ConnectWalletButton />
          </div>
        )} */}
        {isStudio && <SignInUserButton />}
      </div>
    </NavigationMenu>
  );
};

export default HomePageNavbar;
