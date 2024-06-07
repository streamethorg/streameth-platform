'use client'

import { SidebarUI, SidebarItem } from './Sidebar'
import {
  CalendarDays,
  Videotape,
  Radio,
  ScissorsLineDashed,
  Home,
  ImageIcon,
  Settings,
} from 'lucide-react'

const navigationItems = [
  {
    text: 'Home',
    navigationPath: '',
    icon: <Home size={25} />,
  },
  // {
  //   text: 'Events',
  //   navigationPath: '/events',
  //   icon: <CalendarDays size={20} />,
  // },
  {
    text: 'Library',
    navigationPath: '/library',
    icon: <Videotape size={25} />,
  },
  {
    text: 'Livestreams',
    navigationPath: '/livestreams',
    icon: <Radio size={25} />,
  },
  // {
  //   text: 'Clips',
  //   navigationPath: '/clips',
  //   icon: <ScissorsLineDashed size={20} />,
  // },
  // {
  //   text: 'Mint NFT',
  //   navigationPath: '/nfts',
  //   icon: <ImageIcon size={20} />,
  // },
  {
    text: 'Team',
    navigationPath: '/settings',
    icon: <Settings size={25} />,
  },
]

const SidebarMenu = ({
  organizationSlug,
  initalExpanded
}: {
  organizationSlug: string
  initalExpanded?: boolean
}) => {
  return (
    <div className="relative z-[60]">
      <SidebarUI initalExpanded={initalExpanded}>
        {navigationItems.map((item, index) => (
          <SidebarItem
            key={index}
            navigationPath={`/studio/${organizationSlug}${item.navigationPath}`}
            text={item.text}
            icon={item.icon}
          />
        ))}
      </SidebarUI>
    </div>
  )
}

export default SidebarMenu
