'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { TopNavbarContext } from '../../context/TopNavbarContext'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { MobileContext } from '../../context/MobileContext'
import Navbar from './Navbar'
import { getImageUrl } from '@/utils'
import { usePathname } from 'next/navigation'
import MintButton from '../misc/MintButton'

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
    className="md:hidden z-50 ml-2">
    {!isNavVisible ? (
      <Bars3Icon className="w-7 h-7 bg-base  rounded text-white mx-auto" />
    ) : (
      <XMarkIcon className="w-7 h-7 bg-base  rounded  text-white mx-auto" />
    )}
  </button>
)

export default function NavbarTop() {
  const { logo, pages, homePath, showNav, components } =
    useContext(TopNavbarContext)
  const { isMobile } = useContext(MobileContext)
  const [menuVisible, setMenuVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!isMobile) {
      setMenuVisible(true)
    } else {
      setMenuVisible(false)
    }
  }, [isMobile])

  if (!showNav) {
    return null
  }

  return (
    <header className="sticky z-[99999] flex flex-row items-center bg-accent border-b border-primary w-full ml-auto p-2 md:p-4 py-2 top-0 h-16 lg:h-20">
      <div className=" flex items-center">
        <Link href={homePath ? homePath : '/'} className="">
          <span className="sr-only">Logo</span>
          <Image
            className=" h-full w-full p-2 pr-4"
            src={getImageUrl(logo)}
            alt="Logo"
            width={40}
            height={40}
          />
        </Link>
      </div>
      <div className="flex flex-row items-center justify-end md:justify-between  w-full">
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
        <div className="px-5 hidden lg:flex items-center gap-6">
          <Link
            href="https://twitter.com/streameth"
            target="_blank"
            rel="noreferrer">
            <Image
              width={35}
              height={35}
              src="/logo.png"
              alt="streameth logo"
            />
          </Link>

          <Link
            href="https://twitter.com/Livepeer"
            target="_blank"
            rel="noreferrer">
            <Image
              width={25}
              height={25}
              src="/livepeer_black.png"
              alt="livepeer logo"
            />
          </Link>
        </div>
        {pathname.includes('swarm') ? (
          <MintButton
            className="!text-[12px] font-medium !md:text-[16px]"
            address="0xcA41A03CD3017aA4B19530816261A989593312a4"
            mintText="MINT LIVESTREAM NFT"
          />
        ) : (
          <Link
            href="/"
            className="hidden font-ubuntu p-2 min-w-fit md:flex items-center rounded-xl text-sm bg-base uppercase text-white ml-5">
            Back to overview
          </Link>
        )}
      </div>
    </header>
  )
}
