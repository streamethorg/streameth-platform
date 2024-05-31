'use client'
import Link from 'next/link'
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { NavBarProps } from '@/lib/types'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

export default function Navbar({
  setIsNavVisible,
  isMobile,
  pages,
  organization,
}: {
  isMobile?: boolean
  setIsNavVisible?: React.Dispatch<React.SetStateAction<boolean>>
  pages: NavBarProps['pages']
  organization?: string
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
                {/* <div className="ml-2 text-black">{item.icon}</div> */}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
        {organization === 'ethprague' && (
          <Dialog>
            <DialogTrigger>
              <NavigationMenuItem
                className={`${navigationMenuTriggerStyle()} bg-muted`}>
                Schedule
              </NavigationMenuItem>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-54px)] lg:min-w-[1000px] xl:min-w-[1250px] 2xl:min-w-[1400px] h-[calc(100vh-54px)] md:h-[800px] p-2 md:p-0">
              <iframe
                src="https://ethprague.com/schedule"
                width="100%"
                height="100%"
                name="myiFrame"></iframe>
            </DialogContent>
          </Dialog>
        )}
        <NavigationMenuItem key={'connect'} className="lg:hidden">
          <ConnectWalletButton className="w-full rounded-none" />
        </NavigationMenuItem>
      </ul>
    </div>
  )
}
