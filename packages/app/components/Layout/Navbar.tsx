'use client';
import Link from 'next/link';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { NavBarProps } from '@/lib/types';
import { SignInUserButton } from '../misc/SignInUserButton';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { ConnectWalletButton } from '../misc/ConnectWalletButton';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

export default function Navbar({
  setIsNavVisible,
  isMobile,
  pages,
  organization,
}: {
  isMobile?: boolean;
  setIsNavVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  pages: NavBarProps['pages'];
  organization?: string;
}) {
  const pathname = usePathname();
  const isStudio = pathname.includes('studio');
  if (pages.length === 0) {
    return null;
  }

  if (pages.length < 2) {
    return (
      <div className="">
        <ul
          onClick={() => isMobile && setIsNavVisible?.(false)}
          className="flex w-full flex-col lg:flex-row lg:space-x-2 lg:px-2"
        >
          {pages.map((item) => (
            <NavigationMenuItem key={item.name}>
              <Link href={item.href} legacyBehavior passHref>
                <Button variant={item.bgColor} className="">
                  {item.name}
                  {/* <div className="ml-2 text-black">{item.icon}</div> */}
                </Button>
              </Link>
            </NavigationMenuItem>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-[56px] z-50 flex w-screen items-center text-center lg:relative lg:top-[unset] lg:h-full lg:w-[unset] lg:items-center">
      <ul
        onClick={() => isMobile && setIsNavVisible?.(false)}
        className="flex w-full flex-col lg:flex-row lg:space-x-2 lg:px-2"
      >
        {pages.map((item) => (
          <NavigationMenuItem key={item.name}>
            <Link href={item.href} legacyBehavior passHref>
              <Button variant={item.bgColor} className="">
                {item.name}
                {/* <div className="ml-2 text-black">{item.icon}</div> */}
              </Button>
            </Link>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem key={'connect'} className="lg:hidden">
          {isStudio && <SignInUserButton className="w-full rounded-none" />}
        </NavigationMenuItem>
      </ul>
    </div>
  );
}
