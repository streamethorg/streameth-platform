'use client';

import React, { useState, Suspense, useLayoutEffect } from 'react';
import Image from 'next/image';
import SearchBar from '@/components/misc/SearchBar';
import Link from 'next/link';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';
import { Search } from 'lucide-react';
import { Page } from '@/lib/types';
import SwitchOrganization from '@/app/studio/[organization]/components/SwitchOrganization';
import { IExtendedOrganization } from '@/lib/types';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { notFound, usePathname } from 'next/navigation';
import { IconLeft } from 'react-day-picker';
import useSearchParams from '@/lib/hooks/useSearchParams';
import UserProfile from '@/app/studio/[organization]/components/UserProfile';

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
  organizations: IExtendedOrganization[] | null;
  currentOrganization?: string;
}) => {
  if (logo === '') {
    logo = undefined;
  }

  const organization = organizations?.filter(
    (org) => org.slug === currentOrganization
  )[0];

  if (!organization) {
    return notFound();
  }

  return (
    <Suspense fallback={null}>
      <MobileNavBar
        logo={logo}
        pages={pages}
        showSearchBar={showSearchBar}
        organizations={organizations}
        currentOrganization={currentOrganization || ''}
        showLogo={showLogo}
      />
      <PCNavBar
        showLogo={showLogo}
        logo={logo}
        pages={pages}
        showSearchBar={showSearchBar}
        organization={organization}
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
  showLogo = true,
}: {
  logo?: string;
  pages: Page[];
  showSearchBar: boolean;
  organizations: IExtendedOrganization[] | null;
  currentOrganization: string;
  showLogo?: boolean;
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const toggleSearch = () => setSearchVisible(!searchVisible);
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const pathname = usePathname();
  const { searchParams, handleTermChange } = useSearchParams();

  const showGoBack =
    pathname.includes('clips') && searchParams.has('selectedRecording');

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
          <SearchBar
            organizationSlug={currentOrganization}
            organizationId={currentOrganization}
            isMobile={true}
          />
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
          <Link href={`/studio/${currentOrganization}/clips`}>
            <Button className="mr-2" variant="outline" size="sm">
              <IconLeft className="mr-1" /> Go back
            </Button>
          </Link>
        ) : (
          showLogo && (
            <Link href={`/${currentOrganization}`}>
              <Image
                src={'/logo_dark.png'}
                alt="Logo"
                height={360}
                width={150}
                className="h-full"
              />
            </Link>
          )
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
        {menuVisible && (
          <div className="absolute left-0 top-full p-4 w-full shadow-md bg-background">
            <nav className="flex flex-col space-y-2">
              {pages.map((page) => (
                <Link key={page.href} href={page.href}>
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-left"
                  >
                    {page.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
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
  organization,
}: {
  logo?: string;
  pages: Page[];
  showLogo: boolean;
  showSearchBar: boolean;
  organization: IExtendedOrganization;
}) => {
  const pathname = usePathname();
  const { searchParams } = useSearchParams();

  const showGoBack =
    pathname.includes('clips') && searchParams.has('videoType');

  return (
    <NavigationMenu className="hidden sticky top-0 flex-row justify-between items-center p-2 px-4 w-full bg-white border-b md:hidden lg:flex h-18 z-[30]">
      <div className="flex flex-1 justify-start items-center">
        {showLogo && (
          <Link href={`/${organization.slug}`}>
            <Image
              src={'/logo_dark.png'}
              alt="Logo"
              width={230}
              height={50}
              className="hidden lg:block"
            />
          </Link>
        )}
      </div>
      <div className="flex justify-center items-center mx-auto w-full max-w-md">
        <SearchBar
          searchVisible={showSearchBar}
          organizationSlug={organization.slug!}
          organizationId={organization._id.toString()}
        />
      </div>
      <div className="flex flex-1 justify-end items-center">
        {organization ? (
          <UserProfile organization={organization} />
        ) : (
          <Button variant="primary">
            <Link href={`/studio/login`}>Login</Link>
          </Button>
        )}
      </div>
    </NavigationMenu>
  );
};

export default HomePageNavbar;
