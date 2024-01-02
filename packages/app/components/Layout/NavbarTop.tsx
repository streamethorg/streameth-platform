'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { TopNavbarContext } from '../../context/TopNavbarContext'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Navbar from './Navbar'
import { getImageUrl } from '@/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'

import { NavigationMenu } from '@/components/ui/navigation-menu'
import { AspectRatio } from '../ui/aspect-ratio'
export interface Page {
  name: string
  href: string
  icon: JSX.Element
}

const NavBarButton = ({
  isNavVisible,
  setIsNavVisible,
}: {
  isNavVisible: boolean
  setIsNavVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => (
  <button
    onClick={() => setIsNavVisible(!isNavVisible)}
    className="md:hidden z-50">
    {!isNavVisible ? (
      <Bars3Icon className="w-[40px] h-[40px] bg-background  rounded text-white mx-auto" />
    ) : (
      <XMarkIcon className="w-[40px] h-[40px] bg-background  rounded  text-white mx-auto" />
    )}
  </button>
)

export default function NavbarTop() {
  const { logo, pages, homePath, showNav, components } =
    useContext(TopNavbarContext)

  const isMobile = useMediaQuery('(max-width: 768px)')
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    setMenuVisible(!isMobile)
  }, [isMobile])

  console.log(isMobile)

  if (!showNav) {
    return null
  }

  return (
    <NavigationMenu className="z-[99999999] bg-accent sticky top-0">
      <div className="flex p-2 px-2 md:px-4 w-full">
        <div className="flex items-center">
          <Link href={homePath ? homePath : '/'} className="">
            <span className="sr-only">Logo</span>
            <Image
              className="rounded max-w-[40px]"
              src={getImageUrl(logo)}
              alt="Logo"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className=" flex flex-row items-center justify-end md:justify-between h-full w-full">
          {menuVisible && (
            <Navbar
              pages={
                isMobile
                  ? [
                      ...pages,
                      {
                        name: 'Back to overview',
                        href: '/',
                        icon: <></>,
                      },
                    ]
                  : pages
              }
            />
          )}
          {components.length > 0 &&
            components.map((component, index) => {
              return (
                <div className="flex-1 px-2 " key={index}>
                  {component}
                </div>
              )
            })}

          {pages.length > 1 && (
            <NavBarButton
              isNavVisible={menuVisible}
              setIsNavVisible={setMenuVisible}
            />
          )}
        </div>
      </div>
    </NavigationMenu>
  )
}
