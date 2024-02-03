'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Navbar from './Navbar'

import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { NavBarProps } from '@/lib/types'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'

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
      <Bars3Icon className="w-[40px] h-[40px]   rounded  mx-auto" />
    ) : (
      <XMarkIcon className="w-[40px] h-[40px]   rounded   mx-auto" />
    )}
  </button>
)

export default function NavbarTop({
  pages,
  logo,
  homePath,
  showNav,
}: NavBarProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    setMenuVisible(!isMobile)
  }, [isMobile])

  if (!showNav) {
    return null
  }
  return (
    <NavigationMenu className="z-[69] bg-event sticky top-0">
      <div className="flex p-2 px-2 lg:px-4 w-full justify-between">
        <div className="flex items-center">
          <Link href={homePath ? homePath : '/'} className="">
            <span className="sr-only">Logo</span>
            <Image
              className="rounded max-w-[40px]"
              src={logo}
              alt="Logo"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className=" flex flex-row items-center justify-end h-full w-full">
          {menuVisible && (
            <Navbar
              pages={
                isMobile
                  ? [
                      ...pages,
                      {
                        name: 'Back to overview',
                        href: '/',
                      },
                    ]
                  : pages
              }
            />
          )}
          {pages.length > 1 && (
            <NavBarButton
              isNavVisible={menuVisible}
              setIsNavVisible={setMenuVisible}
            />
          )}
          <ConnectWalletButton />
        </div>
      </div>
    </NavigationMenu>
  )
}
