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
import {
  ArrowLeftToLine,
  ArrowRightFromLine,
  Image as ImageIcon,
} from 'lucide-react'
import Image from 'next/image'
import StreamethStudio from '@/lib/svg/StreamethStudio'
import StreamethLogo from '@/lib/svg/StreamethLogo'

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
  {
    title: 'Mint NFT',
    navigationPath: 'nfts',
    icon: <ImageIcon />,
    defaultCollapsed: false,
  },
  // {
  //   title: 'Settings',
  //   navigationPath: 'settings',
  //   icon: <Settings />,
  //   defaultCollapsed: false,
  // },
]

const Navigation = ({
  organizationSlug,
}: {
  organizationSlug: string
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'bg-primary overflow-auto w-full h-full border-r border-border flex flex-col text-black',
        {
          'max-w-[50px]': isCollapsed,
          'max-w-[250px]': !isCollapsed,
          'transition-max-width': true,
        }
      )}
      style={{
        transition: 'max-width 0.3s ease-out-in',
      }}>
      {isCollapsed ? (
        <div className="my-2 mx-1">
          <StreamethLogo />
        </div>
      ) : (
        <div className="p-2 my-2 mx-4 h-[56px] w-[180px]">
          <StreamethStudio />
        </div>
      )}

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
        className="flex justify-center items-center mt-auto mb-5 w-full text-white cursor-pointer">
        {isCollapsed ? (
          <ArrowRightFromLine className="cursor-pointer" />
        ) : (
          <div className="flex flex-row">
            <ArrowLeftToLine className="mr-1 cursor-pointer" />
            Collapse
          </div>
        )}
      </div>
    </aside>
  )
}

export default Navigation
