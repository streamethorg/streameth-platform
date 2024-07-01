'use client'

import { SidebarUI, SidebarItem } from './Sidebar'
import { CiLocationOn } from 'react-icons/ci'

import {
  LuUsers,
  LuVideotape,
  LuHome,
  LuSettings,
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
      icon: <CiLocationOn size={25} />,
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
