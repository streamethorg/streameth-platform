'use client'
import { PropsWithChildren } from 'react'
import { AdminWrapper } from './components/AdminWrapper'
import AdminSideNav from './AdminSideNav'

export default function AdminLayout(props: PropsWithChildren) {
  return (
    <AdminWrapper>
      <div className="flex flex-row h-full w-full overflow-y-hidden ">
        <AdminSideNav />
        <div className="w-full flex">{props.children}</div>
      </div>
    </AdminWrapper>
  )
}
