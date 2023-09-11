'use client'

import { PropsWithChildren } from 'react'
import { AdminWrapper } from './components/AdminWrapper'

export default function AdminLayout(props: PropsWithChildren) {
  return <AdminWrapper>{props.children}</AdminWrapper>
}
