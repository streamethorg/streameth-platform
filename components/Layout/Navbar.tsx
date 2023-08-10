'use client'
import { useContext } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ModalContext } from '../context/ModalContext'
import { CameraIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import img from '@/public/logo.png'
interface Page {
  name: string
  href: string
  icon: JSX.Element
}

export default function Navbar({
  pages,
  stages,
}: {
  stages: Page[]
  pages: {
    name: string
    href: string
    icon: JSX.Element
  }[]
}) {
  const pathname = usePathname()
  const { openModal } = useContext(ModalContext)

  const stageModal = () => {
    openModal(
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold uppercase mb-2 text-accent">
          Select a stage
        </h1>
        {stages.map((stage) => (
          <div className={`p-4 border-2 rounded m-1 ${pathname === stage.href && 'bg-accent rounded text-primary'}`} key={stage.name}>
            <Link key={stage.name} href={stage.href}>
              <p className="">{stage.name}</p>
            </Link>
          </div>
        ))}
      </div>
    )
  }

  return (
    <header className=" shadow lg:shadow-sm z-20 bg-base lg:border-r border-primary fixed bottom-0 lg:top-0 lg:left-0 w-full lg:w-20 lg:h-screen">
      <div className="flex flex-row lg:flex-col lg:items-center justify-between ">
        <div className="hidden items-center lg:flex lg:py-2">
          <Link href="/">
            <span className="sr-only">Logo</span>
            <Image src={img} alt="Logo" width={50} />
          </Link>
        </div>
        <nav
          aria-label="Global"
          className={`text-main-text text-center w-full space-x-3 my-1 lg:space-x-0 justify-between lg:gap-3 text-sm lg:text-md font-medium flex flex-row lg:flex-col `}>
          {pages.map((item) => (
            <Link
              key={item.name}
              className={`py-1 h-full w-full cursor-pointer hover:text-gray-300 ${pathname === item.href && 'bg-accent rounded text-primary'}`}
              href={item.href}>
              <div className="w-6 h-6 lg:w-8 lg:h-8 m-auto p-1">{item.icon}</div>
              <p className="">{item.name}</p>
            </Link>
          ))}
          {stages.length > 0 && (
            <div
              onClick={stageModal}
              className={`py-1 h-full w-full cursor-pointer hover:text-gray-300 ${pathname.includes('/stage/') && 'bg-accent text-primary rounded'}`}>
              <div className="w-6 h-6 lg:w-8 lg:h-8 m-auto p-1">
                <CameraIcon />
              </div>
              stages
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
