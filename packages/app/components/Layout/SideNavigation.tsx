import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import { buttonVariants } from '@/components/ui/button'

import Link from 'next/link'

export type variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
interface link {
  title: string
  label?: string
  icon: LucideIcon
  variant: variant
  href: string
}

export default function SideNavigation({
  isCollapsed,
  links: linksData,
  currentPath,
}: {
  isCollapsed: boolean
  links: link[]
  currentPath: string
}) {
  const links = linksData.map((link) => ({
    ...link,
    variant:
      link.href === currentPath
        ? ('secondary' as variant)
        : ('ghost' as variant),
  }))

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-row gap-4 ">
      <nav className="">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              buttonVariants({ variant: link.variant, size: 'sm' }),
              link.variant === 'default' &&
                'dark:bg-muted dark: dark:hover:bg-muted dark:hover:',
              'justify-start'
            )}>
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
            {link.label && (
              <span
                className={cn(
                  'ml-auto',
                  link.variant === 'default' && ' dark:'
                )}>
                {link.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}
