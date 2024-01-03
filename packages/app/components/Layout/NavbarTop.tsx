'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Navbar from './Navbar'
import { getImageUrl } from '@/lib/utils'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { NavBarProps } from '@/lib/types'

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
  console.log(getImageUrl(logo))
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
                      },
                    ]
                  : pages
              }
            />
          )}
          {/* {components.length > 0 &&
            components.map((component, index) => {
              return (
                <div className="flex-1 px-2 " key={index}>
                  {component}
                </div>
              )
            })} */}

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
