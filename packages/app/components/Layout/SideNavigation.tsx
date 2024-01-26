'use client'
import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import useSearchParams from '@/lib/hooks/useSearchParams'
import { File, Inbox } from 'lucide-react'

interface NavProps {
  isCollapsed: boolean
  links: link[]
}
interface link {
  title: string
  label?: string
  icon: LucideIcon
  variant: 'default' | 'ghost'
}

export function Nav({ isCollapsed, links }: NavProps) {
  // const { searchParams, handleTermChange } = useSearchParams({
  //   key: 'settings',
  // })

  // const links = linksData.map((link) => {
  //   return {
  //     ...link,
  //     variant:
  //       link.title === searchParams.get('settings')
  //         ? ('default' as link['variant'])
  //         : ('ghost' as link['variant']),
  //   }
  // })

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 border-r ">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  // onClick={() => handleTermChange(link.title)}
                  className={cn(
                    buttonVariants({
                      variant: link.variant,
                      size: 'icon',
                    }),
                    'h-12 w-12',
                    link.variant === 'default' &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:'
                  )}>
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <div
              key={index}
              // onClick={() => handleTermChange(link.title)}
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
            </div>
          )
        )}
      </nav>
    </div>
  )
}
