'use client'

import { PropsWithChildren, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { IEvent } from '../../../server/model/event'

export function ArchiveContext(props) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (
      props.event.archiveMode &&
      !pathname.includes('/archive') &&
      !pathname.includes('/session')
    ) {
      router.push(`${pathname}/archive`)
    }
  }, [props, router, pathname])

  return props.children
}
