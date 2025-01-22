import { SidebarUI, SidebarItem } from './Sidebar';

import {
  LuUsers,
  LuVideotape,
  LuHome,
  LuSettings,
  LuShare2,
  LuLock,
  LuBookOpen,
  LuDollarSign,
} from 'react-icons/lu';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchOrganization } from '@/lib/services/organizationService';

const SidebarMenu = async ({
  organizationSlug,
}: {
  organizationSlug: string;
}) => {
  const organization = await fetchOrganization({
    organizationSlug,
  });

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
    {
      text: 'Team',
      url: `/studio/${organizationSlug}/team`,
      icon: <LuUsers size={25} />,
    },
    {
      text: 'Subscription',
      url: `/studio/${organizationSlug}/payments`,
      icon: <LuDollarSign size={25} />,
    },
    {
      text: 'Docs',
      url: 'https://streameth.notion.site/StreamETH-Docs-f31d759cea824b0ea8f959a4608b0b42',
      icon: <LuBookOpen size={25} />,
    },
  ];

  // Calculate days left until expiration
  let daysLeft: number | undefined;
  if (organization?.expirationDate) {
    const expiryDate = new Date(organization.expirationDate);
    const now = new Date();
    daysLeft = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );
  }

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
              <Link href={`/studio/${organizationSlug}/settings`}>
                Settings
              </Link>
            </Button>

            <Button variant={'outline'} size={'sm'}>
              <Link href={`/${organizationSlug}`}>Channel </Link>
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
