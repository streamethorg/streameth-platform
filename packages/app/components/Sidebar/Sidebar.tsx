'use client'
import { ChevronLast, ChevronFirst, BookOpenText } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useContext, createContext, useState, ReactNode } from 'react'
import Logo from '@/public/logo.png'
import LogoDark from '@/public/logo_dark.png'
import Image from 'next/image'

const SidebarContext = createContext<
  { expanded: boolean } | undefined
>(undefined)

export const SidebarUI = ({
  children,
  initalExpanded,
}: {
  children: ReactNode
  initalExpanded?: boolean
}) => {
  const [expanded, setExpanded] = useState(initalExpanded ?? false)

  return (
    <aside className="flex flex-col h-screen bg-white border-r">
      <div className="flex justify-between items-center p-4">
        <div
          className={`flex items-center overflow-hidden transition-all ${expanded ? 'w-40' : 'w-10'
            }`}>
          <div className="transition-all">
            {expanded ? (
              <Image
                src={LogoDark}
                width={140}
                height={40}
                alt="log"
              />
            ) : (
              <Image src={Logo} width={40} height={40} alt="log" />
            )}
          </div>
        </div>
      </div>

      <SidebarContext.Provider value={{ expanded }}>
        <ul className="flex-1 px-3 space-y-4">
          {children}
        </ul>
      </SidebarContext.Provider>
      <button
        onClick={() => setExpanded((curr) => !curr)}
        className="p-1.5 text-black mx-auto mb-4">
        {expanded ? (
          <span className="flex flex-row w-full">
            <ChevronFirst />
            Collapse
          </span>
        ) : (
          <ChevronLast />
        )}
      </button>
    </aside>
  )
}

export const SidebarItem = ({
  icon,
  text,
  navigationPath,
  isExternal = false
}: {
  icon: ReactNode
  text: string
  navigationPath: string
  isExternal?: boolean
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const active = pathname === navigationPath
  const { expanded } = useContext(SidebarContext) ?? {
    expanded: true,
  }

  const handleClick = () => {
    if (isExternal) {
      window.open(navigationPath, '_blank', 'noopener,noreferrer')
    } else {
      router.push(navigationPath)
    }
  }

  return (
    <li
      onClick={handleClick}
      className={`
        relative flex items-center py-2
        font-medium rounded-md cursor-pointer
        transition-colors group hover:border hover:border-primary hover:rounded-xl
        ${active && !isExternal ? 'border border-primary rounded-xl' : 'border border-white'}
        ${expanded ? 'px-2' : 'justify-center'}
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all text-sm ${expanded ? 'ml-3' : 'hidden'}`}
      >
        {text}
      </span>

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-4
            z-[9999]
            bg-primary text-sm text-white
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  )
}
