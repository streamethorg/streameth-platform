'use client'
import { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {  Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { IEvent } from '@/server/model/event'
import { TopNavbarContext } from '../context/TopNavbarContext'

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
  <button onClick={() => setIsNavVisible(!isNavVisible)} className="lg:hidden md:p-4 absolute top-0 right-0 z-50 mr-16 py-3">
    {!isNavVisible ? (
      <div className="border-2 rounded border-accent text-white bg-accent">
        <Bars3Icon className="w-8 h-8" />
      </div>
    ) : (
      <div className="border-2 border-accent rounded text-white bg-accent">
        <XMarkIcon className="w-8 h-8" />
      </div>
    )}
  </button>
)

const NavBarItem = ({ item, pathname }: { item: Page; pathname: string }) => (
  <Link href={item.href}>
    <div
      className={`flex flex-col py-1 h-full w-full cursor-pointer hover:text-gray-300 ${pathname === item.href && 'underline text-accent'}`}>
      <p className="">{item.name}</p>
    </div>
  </Link>
)

export default function Navbar({
  event,
  pages,
  stages,
  archiveMode,
}: {
  archiveMode?: boolean
  event: IEvent
  stages: Page[] | undefined
  pages: {
    name: string
    href: string
    icon: JSX.Element
  }[]
}) {
  const pathname = usePathname()
  const { setLogo, logo, setHomePath } = useContext(TopNavbarContext)
  const [isNavVisible, setIsNavVisible] = useState(false) // New state

  useEffect(() => {
    if (isNavVisible) {
      setIsNavVisible(false)
    }
    setHomePath(`/${event.organizationId}/${event.id}`)
  }, [pathname])

  useEffect(() => {
    setLogo('/events/' + event.logo)
  }, [event])

  if (archiveMode) {
    return <></>
  }

  return (
    <div>
      <NavBarButton isNavVisible={isNavVisible} setIsNavVisible={setIsNavVisible} />
      <header
        className={` shadow-sm z-40 bg-base border-r border-primary sticky left-0 w-screen ${
          isNavVisible ? 'block' : 'hidden'
        } lg:block`}>
        <nav aria-label="Global" className="items-center flex flex-row space-x-4 w-full h-10 max-w-7xl mx-auto">
          {pages.map((item) => (
            <NavBarItem key={item.name} item={item} pathname={pathname} />
          ))}
          {stages && stages?.length === 1 ? (
            <NavBarItem key={stages[0].name} item={stages[0]} pathname={pathname} />
          ) : stages ? (
            stages.map((stage) => <NavBarItem key={stage.name} item={stage} pathname={pathname} />)
          ) : null}
        </nav>
      </header>
    </div>
  )
}
