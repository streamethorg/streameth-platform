'use client'

import StreamethStudio from '@/lib/svg/StreamethStudio'
import { ChevronLast, ChevronFirst } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useContext, createContext, useState, ReactNode } from 'react'

const SidebarContext = createContext<
  { expanded: boolean } | undefined
>(undefined)

export const SidebarUI = ({ children }: { children: ReactNode }) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside className="flex flex-col h-screen border-r bg-primary">
      <div className="flex justify-between items-center p-4 pb-2">
        <div
          className={`flex items-center overflow-hidden transition-all ${
            expanded ? 'w-48' : 'w-0'
          }`}>
          <div className="pl-2">
            <StreamethStudio />
          </div>
        </div>
        <button
          onClick={() => setExpanded((curr) => !curr)}
          className="p-1.5 text-white rounded-lg hover:bg-secondary-foreground">
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      </div>

      <SidebarContext.Provider value={{ expanded }}>
        <ul className="flex-1 px-3 text-white">{children}</ul>
      </SidebarContext.Provider>
    </aside>
  )
}

export const SidebarItem = ({
  icon,
  text,
  navigationPath,
}: {
  icon: ReactNode
  text: string
  navigationPath: string
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const active = pathname === navigationPath
  const { expanded } = useContext(SidebarContext) ?? {
    expanded: true,
  }

  const handleRoute = () => {
    router.push(navigationPath)
  }

  return (
    <li
      onClick={handleRoute}
      className={`
        relative flex items-center py-2 px-3 my-1
            font-medium rounded-md cursor-pointer
            transition-colors group
            ${
              active
                ? 'rounded-lg bg-gradient-to-b from-[#4219FF] to-[#3D22BA]'
                : 'hover:bg-secondary-foreground'
            }
    `}>
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? 'w-52 ml-3' : 'w-0'
        }`}>
        {text}
      </span>

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-primary text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}>
          {text}
        </div>
      )}
    </li>
  )
}
