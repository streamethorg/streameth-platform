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
        isActive && 'underline lg:text-accent'
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
      className="absolute bg-accent top-[60px] left-0 z-[999999999999999999] w-full md:bg-base drop-shadow-lg md:w-[unset] items-center text-center md:relative md:top-[unset] md:drop-shadow-nonetext-white  p-2 md:rounded-xl text-white flex flex-col md:items-center md:flex-row md:space-x-4 md:h-full md:mr-auto">
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
