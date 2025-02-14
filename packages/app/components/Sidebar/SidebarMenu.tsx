'use client';

import { SidebarUI, SidebarItem } from './Sidebar';

import {
  LuUsers,
  LuVideotape,
  LuHome,
  LuShare2,
  LuBookOpen,
  LuDollarSign,
} from 'react-icons/lu';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const SidebarMenu = ({}) => {
  const { organization, organizationId, daysLeft } = useOrganizationContext();

  const navigationItems = [
    {
      text: 'Home',
      url: `/studio/${organizationId}`,
      icon: <LuHome size={25} />,
    },
    {
      text: 'Library',
      url: `/studio/${organizationId}/library`,
      icon: <LuVideotape size={25} />,
    },
    // {
    //   text: 'Destinations',
    //   url: `/studio/${organizationId}/destinations`,
    //   icon: <LuShare2 size={25} />,
    // },
    {
      text: 'Team',
      url: `/studio/${organizationId}/team`,
      icon: <LuUsers size={25} />,
    },
    {
      text: 'Subscription',
      url: `/studio/${organizationId}/payments`,
      icon: <LuDollarSign size={25} />,
    },
    {
      text: 'Docs',
      url: 'https://streameth.notion.site/StreamETH-Docs-f31d759cea824b0ea8f959a4608b0b42',
      icon: <LuBookOpen size={25} />,
    },
  ];

  return (
    <div className="relative w-[1/4] h-full border-t">
      <SidebarUI>
        <div className="flex flex-col items-center justify-center p-2">
          {organization?.logo ? (
            <Image
              className="rounded-full"
              src={organization.logo}
              alt="Logo"
              width={70}
              height={70}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              {organization?.name.slice(0, 2)}
            </div>
          )}
          <p className="text-lg font-bold w-full text-center p-2">
            {organization?.name}
          </p>

          <div className="flex flex-row items-center space-x-2">
            <Button variant={'outline'} size={'sm'}>
              <Link href={`/studio/${organizationId}/settings`}>Settings</Link>
            </Button>

            <Button variant={'outline'} size={'sm'}>
              <Link href={`/${organizationId}`}>Channel </Link>
            </Button>
          </div>
        </div>
        {navigationItems.map((item, index) => (
          <SidebarItem
            key={index}
            url={item.url}
            text={item.text}
            icon={item.icon}
            badge={
              item.text === 'Subscription' &&
              organization?.paymentStatus === 'active' &&
              daysLeft &&
              daysLeft > 0
                ? {
                    text: daysLeft === 1 ? '1 day left' : 'Active',
                    variant: daysLeft === 1 ? 'warning' : 'success',
                  }
                : undefined
            }
          />
        ))}
      </SidebarUI>
    </div>
  );
};

export default SidebarMenu;
