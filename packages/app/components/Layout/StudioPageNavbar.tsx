'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import Image from 'next/image'
import Link from 'next/link'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Navbar from './Navbar'
import SwitchOrganization from '@/app/studio/[organization]/components/SwitchOrganization'
import useUserData from '@/lib/hooks/useUserData'

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

const StudioPageNavbar = ({
  organization,
  children,
}: {
  organization: string
  children?: React.ReactNode
}) => {
  const isMobile = useMediaQuery('(max-width: 1025px)')
  const [menuVisible, setMenuVisible] = useState(false)
  const { userData } = useUserData()

  useEffect(() => {
    setMenuVisible(!isMobile)
  }, [isMobile])

  const pages = [
    {
      name: 'Upload video',
      href: 'https://info.streameth.org/stream-eth-studio',
      bgColor: 'bg-muted ',
    },

    {
      name: 'Create event',
      href: `/studio/${organization}/event/create`,
      bgColor: 'bg-primary text-primary-foreground',
    },
  ]

  return (
    <NavigationMenu className="z-1 sticky top-0 p-2 lg:p-4 border-b flex flex-row items-center">
      <div className=" lg:flex-initial">
        <Link href="/">
          <Image
            className="hidden lg:block"
            src="/logo_dark.png"
            alt="Streameth logo"
            width={230}
            height={40}
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
        {children}
      </div>
      <SwitchOrganization organizations={userData?.organizations} />
      <div className="ml-auto pl-2 flex flex-row items-center justify-end h-full">
        {menuVisible && (
          <Navbar
            isMobile={isMobile}
            setIsNavVisible={setMenuVisible}
            pages={isMobile ? [...pages] : pages}
          />
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

export default StudioPageNavbar
