'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils/utils'
import { Accordion } from '@/components/ui/accordion'
import Logo from '@/public/studio_logo.png'
import LogoCollapsed from '@/public/logo.png'
import NavigationItem from './NavigationItem'
import {
  Radio,
  Videotape,
  Settings,
  Home,
  CalendarDays,
  ScissorsLineDashed,
} from 'lucide-react'
import { ArrowLeftToLine, ArrowRightFromLine } from 'lucide-react'
import Image from 'next/image'
const navigationItems = [
  {
    title: 'Home',
    navigationPath: '',
    icon: <Home />,
    defaultCollapsed: false,
  },
  {
    title: 'Events',
    navigationPath: 'event',
    icon: <CalendarDays />,
    defaultCollapsed: false,
  },
  {
    title: 'Library',
    navigationPath: 'library',
    icon: <Videotape />,
    defaultCollapsed: false,
  },
  {
    title: 'Livestreams',
    navigationPath: 'livestreams',
    icon: <Radio />,
    defaultCollapsed: false,
  },
  {
    title: 'Clips',
    navigationPath: 'clips',
    icon: <ScissorsLineDashed />,
    defaultCollapsed: false,
  },
  {
    title: 'Settings',
    navigationPath: 'settings',
    icon: <Settings />,
    defaultCollapsed: false,
  },
]
const Navigation = ({
  organizationSlug,
}: {
  organizationSlug: string
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'bg-primary overflow-auto w-full h-full border-r border-border flex flex-col text-black',
        {
          'max-w-[50px]': isCollapsed,
          'max-w-[200px]': !isCollapsed,
          'transition-max-width': true,
        }
      )}
      style={{
        transition: 'max-width 0.3s ease-out-in',
      }}>
      <Image
        className="p-2 h-[56px]"
        src={isCollapsed ? LogoCollapsed : Logo}
        alt="Logo"
        width={180}
      />

      <Accordion type="single" className="space-y-4" collapsible>
        {navigationItems.map((item, index) => (
          <NavigationItem
            organization={organizationSlug}
            key={index}
            collapsed={isCollapsed}
            {...item}
          />
        ))}
      </Accordion>

      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="cursor-pointer text-white flex w-full items-center justify-center mt-auto mb-10">
        {isCollapsed ? (
          <ArrowRightFromLine className="cursor-pointer" />
        ) : (
          <div className="flex flex-row ">
            <ArrowLeftToLine className="cursor-pointer mr-1" />
            Collapse
          </div>
        )}
      </div>
    </div>
  )
}

export default Navigation
