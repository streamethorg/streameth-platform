'use client';
import { ChevronLast, ChevronFirst, BookOpenText } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, createContext, useState, ReactNode } from 'react';
import Logo from '@/public/logo.png';
import LogoDark from '@/public/logo_dark.png';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/utils';

const SidebarContext = createContext<{ expanded: boolean } | undefined>(
  undefined
);

export const SidebarUI = ({
  children,
  initalExpanded,
}: {
  children: ReactNode;
  initalExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="flex h-full min-w-[250px] flex-col border-r bg-white">
      <SidebarContext.Provider value={{ expanded }}>
        <ul className="flex-1 space-y-4 px-3">{children}</ul>
      </SidebarContext.Provider>
    </aside>
  );
};

export const SidebarItem = ({
  icon,
  text,
  url,
  badge,
}: {
  icon: ReactNode;
  text: string;
  url: string;
  badge?: { text: string; variant: 'success' | 'warning' | 'error' };
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const active = pathname === url;
  const { expanded } = useContext(SidebarContext) ?? {
    expanded: true,
  };

  const isExternal = url.startsWith('http') || url.startsWith('https');

  const handleClick = () => {
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(url);
    }
  };

  return (
    <li
      onClick={handleClick}
      className={`group relative flex cursor-pointer items-center rounded-md py-2 font-medium transition-colors hover:rounded-xl hover:border hover:border-primary ${
        active && !isExternal
          ? 'rounded-xl border border-primary'
          : 'border border-white'
      } ${expanded ? 'px-2' : 'justify-center'} `}
    >
      {icon}
      <span
        className={`overflow-hidden text-sm transition-all ${
          expanded ? 'ml-3' : 'hidden'
        }`}
      >
        {text}
      </span>
      {badge && expanded && (
        <div className={cn(
          'ml-auto px-2 py-0.5 rounded-full text-xs font-medium',
          badge.variant === 'success' && 'bg-green-100 text-green-700',
          badge.variant === 'warning' && 'bg-amber-100 text-amber-700',
          badge.variant === 'error' && 'bg-red-100 text-red-700'
        )}>
          {badge.text}
        </div>
      )}

      {!expanded && (
        <div
          className={`invisible absolute left-full z-[9999] ml-4 -translate-x-3 rounded-md bg-primary px-2 py-1 text-sm text-white opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
        >
          {text}
        </div>
      )}
    </li>
  );
};
