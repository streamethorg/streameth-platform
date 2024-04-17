'use client'
import Link from 'next/link'
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { NavBarProps } from '@/lib/types'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'

export default function Navbar({
  setIsNavVisible,
  isMobile,
  pages,
}: {
  isMobile?: boolean
  setIsNavVisible?: React.Dispatch<React.SetStateAction<boolean>>
  pages: NavBarProps['pages']
}) {
  if (pages.length === 0) {
    return null
  }

  return (
    <div className="flex absolute right-0 z-50 items-center w-screen text-center lg:relative lg:items-center lg:h-full top-[56px] lg:w-[unset] lg:top-[unset]">
      <ul
        onClick={() => isMobile && setIsNavVisible?.(false)}
        className="flex flex-col w-full lg:flex-row lg:px-2 lg:space-x-2">
        {pages.map((item) => (
          <NavigationMenuItem key={item.name}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={
                  navigationMenuTriggerStyle() + ' ' + item.bgColor
                }>
                {item.name}
                <div className="ml-2">{item.icon}</div>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem key={'connect'} className="md:hidden">
          <ConnectWalletButton className="w-full rounded-none"/>
        </NavigationMenuItem>
      </ul>
    </div>
  )
}
