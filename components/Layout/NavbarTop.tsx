'use client'
import Link from 'next/link'
import Image from 'next/image'
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
    <header className="sticky z-[99999] flex flex-row items-center bg-accent border-b border-primary w-full ml-auto p-4 py-2 top-0 h-16 lg:h-20">
      <div className=" flex items-center w-20">
        <Link href={homePath ? homePath : '/'} className="">
          <span className="sr-only">Logo</span>
          <Image
            className="rounded-full"
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
      <div className="flex flex-row items-center justify-between w-full">
        {menuVisible && <Navbar pages={pages} />}
        {components.length > 0 &&
          components.map((component, index) => {
            return (
              <div className="flex-1 px-2" key={index}>
                {component}
              </div>
            )
          })}
        {/* <div className="flex">
          <SocialIcon
            url={`https://twitter.com/streameth`}
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
          */}
        {pages.length > 1 && (
          <NavBarButton
            isNavVisible={menuVisible}
            setIsNavVisible={setMenuVisible}
          />
        )}
      </div>
      <Link
        href="/"
        className="font-ubuntu p-2 min-w-fit flex items-center rounded-xl text-sm bg-base uppercase text-white ml-5">
        Back to overview
      </Link>
    </header>
  )
}
