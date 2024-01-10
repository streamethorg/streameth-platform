'use client'
import Link from 'next/link'
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { NavBarProps } from '@/lib/types'
export default function Navbar({
  pages,
}: {
  pages: NavBarProps['pages']
}) {
  if (pages.length === 0) {
    return null
  }

  return (
    <div
      className="flex z-50 absolute w-screen top-[56px] right-0  
    md:w-[unset] items-center text-center md:relative md:top-[unset] 
     md:items-center md:h-full md:mr-auto">
      <ul className="flex flex-col md:flex-row w-full md:space-x-2 md:px-2">
        {pages.map((item) => (
          <>
            <NavigationMenuItem key={item.name}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}>
                  {item.name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        ))}
      </ul>
    </div>
  )
}
