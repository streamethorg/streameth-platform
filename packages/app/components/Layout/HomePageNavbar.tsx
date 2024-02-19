'use client'
import React, { useState, Suspense, useLayoutEffect } from 'react'
import Image from 'next/image'
import SearchBar from '@/components/misc/SearchBar'
import Link from 'next/link'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Navbar from './Navbar'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'
import { Search } from 'lucide-react'
import { Page } from '@/lib/types'
import { useSIWE } from 'connectkit'
import useUserData from '@/lib/hooks/useUserData'

const getPages = (
  pages: Page[],
  isSignedIn: boolean,
  studioOrg?: string
) => {
  if (isSignedIn) {
    return [
      ...pages,
      {
        name: 'studio',
        href: studioOrg ? `/studio/${studioOrg}` : '/studio',
        bgColor: 'bg-primary text-primary-foreground',
      },
    ]
  } else return pages
}

const HomePageNavbar = ({
  logo,
  pages,
  showSearchBar = true,
}: {
  logo?: string
  pages: Page[]
  showSearchBar?: boolean
}) => {
  return (
    <Suspense fallback={null}>
      <MobileNavBar pages={pages} showSearchBar={showSearchBar} />
      <PCNavBar pages={pages} showSearchBar={showSearchBar} />
    </Suspense>
  )
}

const MobileNavBar = ({
  pages,
  showSearchBar,
}: {
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
    <NavigationMenu className="lg:hidden z-[999999] backdrop-blur-sm bg-transparent bg-opacity-90 sticky top-0 flex flex-row items-center">
      {(searchVisible || menuVisible) && (
        <div className="h-[100vh] w-[100vw] bg-black bg-opacity-50 absolute top-0 left-0" />
      )}

      {searchVisible && showSearchBar && (
        <div className="absolute bottom-[-56px] w-full bg-secondary">
          <SearchBar />
        </div>
      )}
      <div className="p-2 w-full h-full relative flex flex-row items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            height={36}
            width={36}
            className="aspect-square h-full"
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
                <Bars3Icon className="w-6 h-6 bg-primary text-white rounded" />
              ) : (
                <XMarkIcon className="w-6 h-6 bg-primary text-white rounded" />
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
  pages,
  showSearchBar,
}: {
  pages: Page[]
  showSearchBar: boolean
}) => {
  const { isSignedIn } = useSIWE()
  const { userData } = useUserData()
  return (
    <NavigationMenu className="w-full p-2 hidden md:hidden z-[99] backdrop-blur-sm bg-opacity-90 sticky top-0 lg:flex flex-row items-center justify-between">
      <Link href="/">
        <Image
          src="/logo_dark.png"
          alt="Logo"
          width={230}
          height={30}
          className="hidden lg:block"
        />
      </Link>
      <div className="flex-grow  items-center flex justify-center">
        {showSearchBar && <SearchBar />}
      </div>
      <Navbar
        pages={getPages(
          pages,
          isSignedIn,
          userData?.organizations?.[0]?.slug
        )}
      />
      <ConnectWalletButton />
    </NavigationMenu>
  )
}

export default HomePageNavbar
