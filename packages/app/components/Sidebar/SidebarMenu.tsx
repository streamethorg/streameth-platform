'use client';
import { SidebarUI, SidebarItem } from './Sidebar';

import {
  LuUsers,
  LuVideotape,
  LuHome,
  LuSettings,
  LuShare2,
  LuLock,
  LuBookOpen,
} from 'react-icons/lu';

const SidebarMenu = ({ organizationSlug }: { organizationSlug: string }) => {
  const navigationItems = [
    {
      text: 'Home',
      url: `/studio/${organizationSlug}`,
      icon: <LuHome size={25} />,
    },
    {
      text: 'Library',
      url: `/studio/${organizationSlug}/library`,
      icon: <LuVideotape size={25} />,
    },
    {
      text: 'Destinations',
      url: `/studio/${organizationSlug}/destinations`,
      icon: <LuShare2 size={25} />,
    },
    // WARNING: This is the NFT page only access, commenting this will make user unable to access it
    // {
    //   text: 'NFTs',
    //   url: `/studio/${organizationSlug}/nfts`,
    //   icon: <LuLock size={25} />,
    // },
    {
      text: 'Team',
      url: `/studio/${organizationSlug}/team`,
      icon: <LuUsers size={25} />,
    },
    {
      text: 'Settings',
      url: `/studio/${organizationSlug}/settings`,
      icon: <LuSettings size={25} />,
    },
    {
      text: 'Docs',
      url: 'https://streameth.notion.site/StreamETH-Docs-f31d759cea824b0ea8f959a4608b0b42',
      icon: <LuBookOpen size={25} />,
    },
  ];

  return (
    <div className="relative w-[54px]">
      <SidebarUI>
        {navigationItems.map((item, index) => (
          <SidebarItem
            key={index}
            url={item.url}
            text={item.text}
            icon={item.icon}
          />
        ))}
      </SidebarUI>
    </div>
  );
};

export default SidebarMenu;
