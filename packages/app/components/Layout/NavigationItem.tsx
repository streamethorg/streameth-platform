'use client';
import React from 'react';
import { AccordionItem } from '@/components/ui/accordion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavigationItem = ({
  title,
  navigationPath,
  icon,
  organization,
  collapsed,
}: {
  title: string;
  navigationPath: string;
  icon: React.ReactNode;
  organization: string;
  collapsed?: boolean;
}) => {
  const pathname = usePathname();
  const params = pathname.split('/');

  const active =
    params[3] === navigationPath || (!params[3] && navigationPath === '');

  return (
    <AccordionItem
      value={title}
      title={title}
      className="border-none text-white"
    >
      <Link
        passHref
        className={`flex flex-row items-center border-none font-light no-underline drop-shadow ${
          collapsed ? 'justify-center' : 'mx-4 justify-start'
        } cursor-pointer space-x-2 p-2 ${
          active && 'rounded-lg bg-gradient-to-b from-[#4219FF] to-[#3D22BA]'
        }`}
        href={`/studio/${organization}/${navigationPath}`}
      >
        {icon} {!collapsed && <p>{title}</p>}
      </Link>
    </AccordionItem>
  );
};

export default NavigationItem;
