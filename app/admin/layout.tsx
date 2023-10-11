'use client'

import { PropsWithChildren } from 'react'
import { AdminWrapper } from './components/AdminWrapper'
import AdminSideNav from './AdminSideNav'

export default function AdminLayout(props: PropsWithChildren) {
  return (
    <AdminWrapper>
      <div className="flex gap-[50px]">
        <AdminSideNav />
        {props.children}
      </div>
    </AdminWrapper>
  )
}
