'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import Image from 'next/image'
import SearchBar from '@/components/misc/SearchBar'
import Link from 'next/link'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Navbar from './Navbar'

const NavBarButton = ({
  isNavVisible,
  setIsNavVisible,
}: {
  isNavVisible: boolean
  setIsNavVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => (
  <button
    onClick={() => setIsNavVisible(!isNavVisible)}
    className="lg:hidden z-50">
    {!isNavVisible ? (
      <Bars3Icon className="w-[36px] h-[36px] bg-primary  rounded  mx-auto" />
    ) : (
      <XMarkIcon className="w-[36px] h-[36px] bg-primary  rounded   mx-auto" />
    )}
  </button>
)

const HomePageNavbar = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    setMenuVisible(!isMobile)
  }, [isMobile])

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
    {
      name: 'studio',
      href: '/studio/base',
      bgColor: 'bg-primary text-primary-foreground',
    },
  ]

  return (
    <NavigationMenu className="z-[99] backdrop-blur-sm bg-background bg-opacity-90 sticky top-0 p-2 lg:p-2 flex flex-row items-center">
      <div className=" lg:flex-initial">
        <Link href="/">
          <Image
            className="hidden lg:block"
            src="/logo_dark.png"
            alt="Streameth logo"
            width={230}
            height={30}
          />
          <Image
            className="block lg:hidden aspect-square h-full"
            src="/logo.png"
            alt="Streameth logo"
            height={36}
            width={36}
          />
        </Link>
      </div>
      <div className="flex-grow mx-2 flex justify-center">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>
      <div className="ml-auto flex flex-row items-center justify-end h-full">
        {menuVisible && (
          <Navbar pages={isMobile ? [...pages] : pages} />
        )}
        {pages.length > 1 && (
          <NavBarButton
            isNavVisible={menuVisible}
            setIsNavVisible={setMenuVisible}
          />
        )}
      </div>
    </NavigationMenu>
  )
}

export default HomePageNavbar
