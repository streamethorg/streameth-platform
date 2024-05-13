'use client'
import React, { useState, Suspense, useLayoutEffect } from 'react'
import Image from 'next/image'
import SearchBar from '@/components/misc/SearchBar'
import Link from 'next/link'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { Menu, X } from 'lucide-react'
import Navbar from './Navbar'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'
import { Search } from 'lucide-react'
import { Page } from '@/lib/types'
import { useSIWE } from 'connectkit'
import useUserData from '@/lib/hooks/useUserData'
import SwitchOrganization from '@/app/studio/[organization]/components/SwitchOrganization'
import { IExtendedOrganization } from '@/lib/types'
import { cn } from '@/lib/utils/utils'
import Support from '../misc/Support'
import { Button } from '@/components/ui/button'
const getPages = (
  pages: Page[],
  isSignedIn: boolean,
  studioOrg?: string
) => {
  if (isSignedIn) {
    return [
      ...pages,
      // {
      //   name: 'studio',
      //   href: studioOrg ? `/studio/${studioOrg}` : '/studio',
      //   bgColor: 'bg-primary text-primary-foreground',
      // },
    ]
  } else return pages
}

const HomePageNavbar = ({
  logo,
  pages,
  showLogo = true,
  showSearchBar = true,
  organizations,
  currentOrganization,
}: {
  logo?: string
  pages: Page[]
  showLogo?: boolean
  showSearchBar?: boolean
  organizations?: IExtendedOrganization[]
  currentOrganization: string
}) => {
  if (logo === '') {
    logo = undefined
  }

  return (
    <Suspense fallback={null}>
      <MobileNavBar
        logo={logo}
        pages={pages}
        showSearchBar={showSearchBar}
        organizations={organizations}
        currentOrganization={currentOrganization}
      />
      <PCNavBar
        showLogo={showLogo}
        logo={logo}
        pages={pages}
        showSearchBar={showSearchBar}
        organizations={organizations}
        currentOrganization={currentOrganization}
      />
    </Suspense>
  )
}

const MobileNavBar = ({
  logo,
  pages,
  showSearchBar,
  organizations,
  currentOrganization,
}: {
  logo?: string
  pages: Page[]
  showSearchBar: boolean
  organizations?: IExtendedOrganization[]
  currentOrganization: string
}) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const toggleSearch = () => setSearchVisible(!searchVisible)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const { isSignedIn } = useSIWE()
  const { userData } = useUserData()

  useLayoutEffect(() => {
    if (menuVisible || searchVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [menuVisible, searchVisible])

  return (
    <NavigationMenu className="flex sticky top-0 flex-row items-center bg-white lg:hidden z-[999999]">
      {(searchVisible || menuVisible) && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-50 h-[100vh] w-[100vw]" />
      )}

      {searchVisible && showSearchBar && (
        <div className="absolute w-full bottom-[-56px] bg-secondary">
          <SearchBar
            organizationSlug={currentOrganization}
            isMobile={true}
          />
        </div>
      )}
      <div
        className={cn(
          'flex relative flex-row  items-center px-4 py-2 w-full h-full',
          menuVisible && 'bg-background',
          searchVisible && showSearchBar && 'bg-background'
        )}>
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
              className="h-full aspect-square"
            />
          </Link>
        )}

        <div className="flex items-center ml-auto">
          {showSearchBar && (
            <button onClick={toggleSearch} className="p-2">
              <Search className="w-6 h-6 text-primary" />
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
          <Navbar
            pages={getPages(
              pages,
              isSignedIn,
              userData?.organizations?.[0]?.slug
            )}
          />
        )}
      </div>
    </NavigationMenu>
  )
}

const PCNavBar = ({
  logo,
  pages,
  showSearchBar,
  showLogo,
  organizations,
  currentOrganization,
}: {
  logo?: string
  pages: Page[]
  showLogo: boolean
  showSearchBar: boolean
  organizations?: IExtendedOrganization[]
  currentOrganization: string
}) => {
  const { isSignedIn } = useSIWE()
  const { userData } = useUserData()
  return (
    <NavigationMenu className="hidden sticky top-0 flex-row justify-between items-center p-2 px-4 w-full bg-white shadow-sm md:hidden lg:flex">
      <div className="flex flex-1 justify-start items-center">
        {showLogo && (
          <Link href="/">
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
        <Navbar
          pages={getPages(
            pages,
            isSignedIn,
            userData?.organizations?.[0]?.slug
          )}
        />
        <ConnectWalletButton />
      </div>
    </NavigationMenu>
  )
}

export default HomePageNavbar
