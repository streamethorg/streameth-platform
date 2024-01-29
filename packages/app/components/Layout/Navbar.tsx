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
    lg:w-[unset] items-center text-center lg:relative lg:top-[unset] 
    lg:items-center lg:h-full">
      <ul className="flex flex-col lg:flex-row w-full lg:space-x-2 lg:px-2">
        {pages.map((item, index) => (
          <NavigationMenuItem key={index}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={
                  navigationMenuTriggerStyle() + ' ' + item.bgColor
                }>
                {item.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </ul>
    </div>
  )
}
