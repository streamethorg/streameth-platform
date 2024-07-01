'use client'

import { SidebarUI, SidebarItem } from './Sidebar'
import {
  UsersRound,
  Videotape,
  Radio,
  Home,
  Settings,
} from 'lucide-react'

const SidebarMenu = ({
  organizationSlug,
}: {
  organizationSlug: string
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
    // {
    //   text: 'Livestreams',
    //   navigationPath: '/livestreams',
    //   icon: <Radio size={25} />,
    // },
    {
      text: 'video NFTs',
      navigationPath: '/nfts',
      icon: <Radio size={25} />,
    },
    {
      text: 'Team',
      navigationPath: '/team',
      icon: <UsersRound size={25} />,
    },
    {
      text: 'Settings',
      navigationPath: `/settings`,
      icon: <Settings size={25} />,
    },
  ]

  return (
    <div className="relative w-[1/4]">
      <SidebarUI>
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
