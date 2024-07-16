'use client';
import { ChevronLast, ChevronFirst, BookOpenText } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, createContext, useState, ReactNode } from 'react';
import Logo from '@/public/logo.png';
import LogoDark from '@/public/logo_dark.png';
import Image from 'next/image';
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
  const [expanded, setExpanded] = useState(initalExpanded ?? false);

  return (
    <aside className="flex h-screen flex-col border-r bg-white">
      <div className="flex items-center justify-between p-4">
        <div
          className={`flex items-center overflow-hidden transition-all ${
            expanded ? 'w-40' : 'w-10'
          }`}
        >
          <div className="transition-all">
            {expanded ? (
              <Image src={LogoDark} width={140} height={40} alt="log" />
            ) : (
              <Image src={Logo} width={40} height={40} alt="log" />
            )}
          </div>
        </div>
      </div>

      <SidebarContext.Provider value={{ expanded }}>
        <ul className="flex-1 space-y-4 px-3">{children}</ul>
      </SidebarContext.Provider>
      <button
        onClick={() => setExpanded((curr) => !curr)}
        className="mx-auto p-1.5 text-black"
      >
        {expanded ? (
          <span className="flex w-full flex-row">
            <ChevronFirst />
            Collapse
          </span>
        ) : (
          <ChevronLast />
        )}
      </button>
      <Link
        className="group relative mx-auto mb-8 flex w-full items-center justify-center space-x-2 rounded-lg p-2 text-black transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        href="https://streameth.notion.site/StreamETH-Docs-f31d759cea824b0ea8f959a4608b0b42"
      >
        <BookOpenText className="h-6 w-6" />
        <span
          className={`overflow-hidden transition-all ${expanded ? '' : 'w-0'}`}
        >
          Docs
        </span>
        {!expanded && (
          <div
            className={`bg-primary invisible absolute left-full ml-2 -translate-x-3 rounded-md px-2 py-1 text-sm text-white opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
          >
            Docs
          </div>
        )}
      </Link>
    </aside>
  );
};

export const SidebarItem = ({
  icon,
  text,
  navigationPath,
}: {
  icon: ReactNode;
  text: string;
  navigationPath: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const active = pathname === navigationPath;
  const { expanded } = useContext(SidebarContext) ?? {
    expanded: true,
  };

  const handleRoute = () => {
    router.push(navigationPath);
  };

  return (
    <li
      onClick={handleRoute}
      className={`hover:border-primary group relative flex cursor-pointer items-center rounded-md py-2 font-medium transition-colors hover:rounded-xl hover:border ${
        active ? 'border-primary rounded-xl border' : 'border border-white'
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

      {!expanded && (
        <div
          className={`bg-primary invisible absolute left-full z-[9999] ml-4 -translate-x-3 rounded-md px-2 py-1 text-sm text-white opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
        >
          {text}
        </div>
      )}
    </li>
  );
};
