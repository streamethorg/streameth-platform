'use client'

import React, {
  useState,
  useEffect,
  Suspense,
  useLayoutEffect,
} from 'react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import Image from 'next/image'
import SearchBar from '@/components/misc/SearchBar'
import Link from 'next/link'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Navbar from './Navbar'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Search } from 'lucide-react'

const pages = [
  {
    name: 'Videography',
    href: 'https://info.streameth.org/stream-eth-studio',
    bgColor: 'bg-muted ',
  },
  {
    name: 'Product',
    href: 'https://info.streameth.org/services',
    bgColor: 'bg-muted ',
  },
  {
    name: 'Host your event',
    href: 'https://info.streameth.org/contact-us',
    bgColor: 'bg-primary text-primary-foreground',
  },
  // {
  //   name: 'studio',
  //   href: '/studio/base',
  //   bgColor: 'bg-primary text-primary-foreground',
  // },
]

const HomePageNavbar = () => {
  return (
    <Suspense fallback={null}>
      <MobileNavBar />
      <PCNavBar />
    </Suspense>
  )
}

const MobileNavBar = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)

  const toggleSearch = () => setSearchVisible(!searchVisible)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  useLayoutEffect(() => {
    if (menuVisible || searchVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [menuVisible, searchVisible])
  return (
    <NavigationMenu className="lg:hidden z-[999999] backdrop-blur-sm bg-background bg-opacity-90 sticky top-0 flex flex-row items-center">
      {(searchVisible || menuVisible) && (
        <div className="h-[100vh] w-[100vw] bg-black bg-opacity-50 absolute top-0 left-0" />
      )}

      {searchVisible && (
        <div className="absolute bottom-[-56px] w-full bg-secondary">
          <SearchBar />
        </div>
      )}
      <div className="bg-white p-2 w-full h-full relative flex flex-row items-center">
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
          {!searchVisible ? (
            <button onClick={toggleSearch} className="p-2">
              <Search className="w-6 h-6 text-primary" />
            </button>
          ) : (
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
        {menuVisible && <Navbar pages={pages} />}

        <ConnectWalletButton />
      </div>
    </NavigationMenu>
  )
}

const PCNavBar = () => {
  return (
    <NavigationMenu className="hidden md:hidden z-[99] backdrop-blur-sm bg-background bg-opacity-90 sticky top-0 p-4 lg:flex flex-row items-center justify-between">
      <Link href="/">
        <Image
          src="/logo_dark.png"
          alt="Logo"
          width={230}
          height={30}
          className="hidden lg:block"
        />
      </Link>
      <div className="flex-grow mx-4 items-center flex justify-center">
        <SearchBar />
      </div>
      <Navbar pages={pages} />
      <ConnectWalletButton />
    </NavigationMenu>
  )
}

export default HomePageNavbar
