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
      className={`text-center flex flex-col py-1 h-full items-center justify-center cursor-pointer hover:text-gray-300 ${
        isActive && 'underline text-accent'
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

  return (
    <nav
      aria-label="Global"
      className="z-[999999] absolute top-[4rem] w-full md:w-[unset] left-0 items-center text-center drop-shadow md:relative md:top-[unset] md:drop-shadow-none bg-white flex flex-col md:items-center md:flex-row md:space-x-4 md:h-full md:mr-auto">
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
