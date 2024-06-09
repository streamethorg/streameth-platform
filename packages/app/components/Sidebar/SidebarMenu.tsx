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



const SidebarMenu = ({
  organizationSlug,
  initalExpanded
}: {
  organizationSlug: string
  initalExpanded?: boolean
}) => {

  const navigationItems = [
    {
      text: 'Home',
      navigationPath: '',
      icon: <Home size={25} />,
    },
    {
      text: 'Library',
      navigationPath: '/library',
      icon: <Videotape size={25} />,
    },
    {
      text: 'Channel Settings',
      navigationPath: `/settings`,
      icon: <Radio size={25} />,
    },
    {
      text: 'Team',
      navigationPath: '/team',
      icon: <Settings size={25} />,
    },
  ]

  return (
    <div className="relative z-[10]">
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
