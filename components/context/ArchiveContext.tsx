'use client'

import { PropsWithChildren } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { IEvent } from '@/server/model/event'

interface Props extends PropsWithChildren {
  event: IEvent
}
export function ArchiveContext(props: Props) {
  const router = useRouter()
  const pathname = usePathname()
  if (props.event.archiveMode && !pathname.endsWith('/archive')) {
    router.push(`${pathname}/archive`)
  }

  return props.children
}