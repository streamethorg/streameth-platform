'use client'
import Link from 'next/link'
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { NavBarProps } from '@/lib/types'
import { SignInUserButton } from '../misc/SignInUserButton'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
  const isStudio = pathname.includes('studio')
  if (pages.length === 0) {
    return null
  }

  return (
    <div className="absolute right-0 top-[56px] z-50 flex w-screen items-center text-center lg:relative lg:top-[unset] lg:h-full lg:w-[unset] lg:items-center">
      <ul
        onClick={() => isMobile && setIsNavVisible?.(false)}
        className="flex w-full flex-col lg:flex-row lg:space-x-2 lg:px-2">
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
            <DialogContent className="h-[calc(100vh-54px)] w-[calc(100vw-54px)] p-2 md:h-[800px] md:p-0 lg:min-w-[1000px] xl:min-w-[1250px] 2xl:min-w-[1400px]">
              <iframe
                src="https://ethprague.com/schedule"
                width="100%"
                height="100%"
                name="myiFrame"></iframe>
            </DialogContent>
          </Dialog>
        )}
        <NavigationMenuItem key={'connect'} className="lg:hidden">
          {isStudio && (
            <SignInUserButton className="w-full rounded-none" />
          )}
        </NavigationMenuItem>
      </ul>
    </div>
  )
}
