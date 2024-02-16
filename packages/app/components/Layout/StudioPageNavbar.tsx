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
    className="z-50 lg:hidden">
    {!isNavVisible ? (
      <Bars3Icon className="mx-auto rounded w-[36px] h-[36px] bg-primary" />
    ) : (
      <XMarkIcon className="mx-auto rounded w-[36px] h-[36px] bg-primary" />
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
      href: '/studio/upload',
      bgColor: 'bg-muted ',
    },

    {
      name: 'Create event',
      href: `/studio/${organization}/event/create`,
      bgColor: 'bg-primary text-primary-foreground',
    },
  ]

  return (
    <NavigationMenu className="flex sticky top-0 flex-row items-center p-2 border-b lg:p-4 z-1">
      <div className="lg:flex-initial">
        <Link href="/">
          <Image
            className="hidden lg:block"
            src="/logo_dark.png"
            alt="Streameth logo"
            width={230}
            height={40}
          />
          <Image
            className="block h-full lg:hidden aspect-square"
            src="/logo.png"
            alt="Streameth logo"
            height={36}
            width={36}
          />
        </Link>
      </div>
      <div className="flex flex-grow justify-center mx-2">
        {children}
      </div>
      <SwitchOrganization organizations={userData?.organizations} />
      <div className="flex flex-row justify-end items-center ml-auto h-full">
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

export default StudioPageNavbar
