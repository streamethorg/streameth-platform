'use client'

import { BookOpenText } from 'lucide-react'
import { SidebarUI, SidebarItem } from './Sidebar'

import {
  LuUsers,
  LuVideotape,
  LuHome,
  LuSettings,
  LuShare2,
  LuLock,
} from 'react-icons/lu'

const SidebarMenu = ({
  organizationSlug,
}: {
  organizationSlug: string
}) => {
  const navigationItems = [
    {
      text: 'Home',
      navigationPath: '',
      icon: <LuHome size={25} />,
    },
    {
      text: 'Library',
      navigationPath: '/library',
      icon: <LuVideotape size={25} />,
    },
    {
      text: 'Destinations',
      navigationPath: '/destinations',
      icon: <LuShare2 size={25} />,
    },
    {
      text: 'NFTs',
      navigationPath: '/nfts',
      icon: <LuLock size={25} />,
    },
    {
      text: 'Team',
      navigationPath: '/team',
      icon: <LuUsers size={25} />,
    },
    {
      text: 'Settings',
      navigationPath: `/settings`,
      icon: <LuSettings size={25} />,
    },
    {
      text: 'Docs',
      navigationPath: 'https://streameth.notion.site/StreamETH-Docs-f31d759cea824b0ea8f959a4608b0b42',
      icon: <BookOpenText size={25} />,
      isExternal: true
    }
  ]

  return (
    <div className="relative w-[1/4]">
      <SidebarUI>
        {navigationItems.map((item, index) => (
          <SidebarItem
            key={index}
            navigationPath={item.isExternal ? item.navigationPath : `/studio/${organizationSlug}${item.navigationPath}`}
            text={item.text}
            icon={item.icon}
            isExternal={item.isExternal}
          />
        ))}
      </SidebarUI>
    </div>
  )
}

export default SidebarMenu
