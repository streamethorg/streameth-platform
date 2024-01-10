'use client'

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  Archive,
  ArchiveX,
  File,
  Inbox,
  Send,
  Trash2,
} from 'lucide-react'

interface NavProps {
  isCollapsed: boolean
  links?: link[]
}
interface link {
  title: string
  label?: string
  icon: LucideIcon
  variant: 'default' | 'ghost'
}

const linksData: link[] = [
  {
    title: 'Inbox',
    label: '128',
    icon: Inbox,
    variant: 'default',
  },
  {
    title: 'Drafts',
    label: '9',
    icon: File,
    variant: 'ghost',
  },
  {
    title: 'Sent',
    label: '',
    icon: Send,
    variant: 'ghost',
  },
  {
    title: 'Junk',
    label: '23',
    icon: ArchiveX,
    variant: 'ghost',
  },
  {
    title: 'Trash',
    label: '',
    icon: Trash2,
    variant: 'ghost',
  },
  {
    title: 'Archive',
    label: '',
    icon: Archive,
    variant: 'ghost',
  },
]

export function Nav({ links = linksData, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 border-r ">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({
                      variant: link.variant,
                      size: 'icon',
                    }),
                    'h-12 w-12',
                    link.variant === 'default' &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                  )}>
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
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
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: 'sm' }),
                link.variant === 'default' &&
                  'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                'justify-start'
              )}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    'ml-auto',
                    link.variant === 'default' &&
                      'text-background dark:text-white'
                  )}>
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}
