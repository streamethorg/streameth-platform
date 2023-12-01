'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
export interface Page {
  name: string
  href: string
  icon: JSX.Element
}
const NavBarItem = ({
  item,
  activePage,
  setActivePage,
}: {
  item: Page
  activePage: string
  setActivePage: React.Dispatch<React.SetStateAction<string>>
}) => {
  const isActive = item.name === activePage
  return (
    <Link
      onClick={() => setActivePage(item.name)}
      href={item.href}
      className={`uppercase text-center flex flex-col py-1 h-full items-center justify-center cursor-pointer hover:text-gray-300 ${
        isActive && 'underline lg:text-gray-300'
      }`}>
      {item.name}
    </Link>
  )
}

export default function Navbar({
  pages,
}: {
  pages: {
    name: string
    href: string
    icon: JSX.Element
  }[]
}) {
  const pathName = usePathname()
  const currentPage = pages.find((page) => page.href === pathName)

  const [activePage, setActivePage] = useState(
    currentPage ? currentPage.name : ''
  )

  if (pages.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Global"
      className="absolute bg-accent top-[60px] right-0 w-full md:text-base md:text-2xl drop-shadow-lg 
      md:w-[unset] items-center text-center md:relative md:top-[unset] 
      md:drop-shadow-none p-2 md:rounded-xl  flex flex-col
       md:items-center md:flex-row md:space-x-6 md:h-full md:mr-auto">
      {pages.map((item) => (
        <NavBarItem
          key={item.name}
          item={item}
          activePage={activePage}
          setActivePage={setActivePage}
        />
      ))}
    </nav>
  )
}
