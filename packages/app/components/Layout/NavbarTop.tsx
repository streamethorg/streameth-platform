'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Navbar from './Navbar'

import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { NavBarProps } from '@/lib/types'
import { SignInUserButton } from '../misc/SignInUserButton'

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
      <Menu
        size={40}
        strokeWidth={1.5}
        className="mx-auto rounded border border-white bg-primary text-white"
      />
    ) : (
      <X
        size={23}
        strokeWidth={1.5}
        className="mx-auto rounded border border-white bg-primary text-white"
      />
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
    <NavigationMenu className="sticky top-0 bg-event">
      <div className="flex w-full justify-between p-2 px-2 lg:px-4">
        <div className="flex items-center">
          <Link href={homePath ? homePath : '/'} className="">
            <span className="sr-only">Logo</span>
            <Image
              className="max-w-[40px] rounded"
              src={logo}
              alt="Logo"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className="flex h-full w-full flex-row items-center justify-end space-x-2">
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
          <SignInUserButton />
        </div>
      </div>
    </NavigationMenu>
  )
}
