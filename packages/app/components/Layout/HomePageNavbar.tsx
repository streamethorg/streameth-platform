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
  showSearchBar = true,
  organizations,
  currentOrganization,
}: {
  logo?: string
  pages: Page[]
  showSearchBar?: boolean
  organizations?: IExtendedOrganization[]
  currentOrganization?: string
}) => {
  return (
    <Suspense fallback={null}>
      <MobileNavBar
        logo={logo}
        pages={pages}
        showSearchBar={showSearchBar}
      />
      <PCNavBar
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
}: {
  logo?: string
  pages: Page[]
  showSearchBar: boolean
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
    <NavigationMenu className="flex sticky top-0 flex-row items-center bg-transparent bg-opacity-90 lg:hidden z-[999999] backdrop-blur-sm">
      {(searchVisible || menuVisible) && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-50 h-[100vh] w-[100vw]" />
      )}

      {searchVisible && showSearchBar && (
        <div className="absolute w-full bottom-[-56px] bg-secondary">
          <SearchBar />
        </div>
      )}
      <div
        className={cn(
          'flex relative flex-row  items-center p-2 w-full h-full',
          menuVisible && 'bg-background',
          searchVisible && showSearchBar && 'bg-background'
        )}>
        <Link href="/">
          <Image
            src={logo ?? '/logo.png'}
            alt="Logo"
            height={36}
            width={36}
            className="h-full aspect-square"
          />
        </Link>

        <div className="flex items-center ml-auto">
          {showSearchBar && (
            <button onClick={toggleSearch} className="p-2">
              <Search className="w-6 h-6 text-primary" />
            </button>
          )}
          {pages.length > 0 && (
            <button onClick={toggleMenu} className="z-50 p-2">
              {!menuVisible ? (
                <Menu
                  size={23}
                  strokeWidth={1.5}
                  className="text-white rounded bg-primary"
                />
              ) : (
                <X
                  size={23}
                  strokeWidth={1.5}
                  className="text-white rounded bg-primary"
                />
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
        <ConnectWalletButton />
      </div>
    </NavigationMenu>
  )
}

const PCNavBar = ({
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
  currentOrganization?: string
}) => {
  const { isSignedIn } = useSIWE()
  const { userData } = useUserData()
  return (
    <NavigationMenu className="hidden sticky top-0 flex-row justify-between items-center p-2 w-full bg-opacity-90 md:hidden lg:flex z-[99] backdrop-blur-sm">
      <Link href="/">
        <Image
          src={logo ?? '/logo_dark.png'}
          alt="Logo"
          width={logo ? 50 : 230}
          height={logo ? 50 : 30}
          className="hidden lg:block"
        />
      </Link>
      <div className="flex flex-grow justify-center items-center">
        {showSearchBar && <SearchBar />}
      </div>

      <Navbar
        pages={getPages(
          pages,
          isSignedIn,
          userData?.organizations?.[0]?.slug
        )}
      />
      {organizations && (
        <div className="m-1 mr-2">
          <SwitchOrganization
            organization={currentOrganization}
            organizations={organizations}
          />
        </div>
      )}
      <ConnectWalletButton />
    </NavigationMenu>
  )
}

export default HomePageNavbar
