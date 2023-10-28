'use client'
import Link from 'next/link'
import Image from 'next/image'
import { SocialIcon } from 'react-social-icons'
import { useContext, useEffect, useState } from 'react'
import { TopNavbarContext } from '../context/TopNavbarContext'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { MobileContext } from '../context/MobileContext'
import Navbar from './Navbar'
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
    className="md:hidden z-50 w-[50px]">
    {!isNavVisible ? (
      <Bars3Icon className="w-7 h-7 border-2 border-accent rounded text-white bg-accent mx-auto" />
    ) : (
      <XMarkIcon className="w-7 h-7 border-2 border-accent rounded text-white bg-accent mx-auto" />
    )}
  </button>
)

export default function NavbarTop() {
  const { logo, pages, homePath, showNav, components } =
    useContext(TopNavbarContext)
  const { isMobile } = useContext(MobileContext)
  const [menuVisible, setMenuVisible] = useState(false)

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
    <header className="sticky z-50 flex flex-row bg-accent border-b border-primary w-full ml-auto  p-4 py-2 top-0 h-16 lg:h-20">
      <div className=" flex items-center w-20">
        <Link href={homePath ? homePath : '/'} className="">
          <span className="sr-only">Logo</span>
          <Image
            src={logo}
            alt="Logo"
            width={50}
            height={50}
            onError={(e) => {
              e.currentTarget.src = '/logo.png'
            }}
          />
        </Link>
      </div>
      <div className="flex flex-row items-center justify-end w-full">
        {menuVisible && <Navbar pages={pages} />}
        {components.length > 0 &&
          components.map((component, index) => {
            return (
              <div className="w-full px-2" key={index}>
                {component}
              </div>
            )
          })}
        {/* <div className="flex">
          <SocialIcon
            url={`https://twitter.com/Scroll_ZKP`}
            target="_blank"
            bgColor="#fff"
            fgColor="#1DA1F2"
            className={` "h-8 w-8"`}
          />
          <SocialIcon
            url={`https://github.com/streamethorg/streameth-platform`}
            target="_blank"
            bgColor="#fff"
            fgColor="#000"
            className={`"h-8 w-8"`}
          />
          {pages.length > 1 && (
            <NavBarButton
              isNavVisible={menuVisible}
              setIsNavVisible={setMenuVisible}
            />
          )}
        </div> */}
      </div>
    </header>
  )
}
